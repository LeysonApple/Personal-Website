(function (root, factory) {
    const contract = typeof module === 'object' && module.exports
        ? require('./sync-contract.js')
        : root.FocendaSyncContract;
    const api = factory(contract);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaLocalTaskRepository = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function (contract) {
    const STORAGE_KEY = 'focenda_local_tasks_v1';
    const BACKUP_KEY = 'focenda_pre_sync_backup_v1';
    const META_FIELDS = new Set([
        'schemaVersion', 'dateKey', 'createdAt', 'updatedAt',
        'deletedAt', 'revision', 'deviceId'
    ]);

    const comparable = (record) => Object.fromEntries(
        Object.entries(record || {}).filter(([key]) => !META_FIELDS.has(key))
    );
    const sameContent = (first, second) => (
        JSON.stringify(comparable(first)) === JSON.stringify(comparable(second))
    );

    const createLocalTaskRepository = (storage, queue, options = {}) => {
        const deviceId = options.deviceId;
        const now = options.now || (() => new Date().toISOString());

        const readStored = () => {
            try {
                const value = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
                return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
            } catch (error) {
                return null;
            }
        };
        const writeStored = (tasksByDate) => storage.setItem(STORAGE_KEY, JSON.stringify(tasksByDate));
        const load = () => {
            const stored = readStored() || {};
            return Object.fromEntries(Object.entries(stored).map(([dateKey, tasks]) => [
                dateKey,
                (Array.isArray(tasks) ? tasks : []).filter((task) => !task.deletedAt).map((task) => ({ ...task }))
            ]));
        };
        const loadRecords = () => Object.values(readStored() || {})
            .flat()
            .filter((task) => task?.id && task?.dateKey)
            .map((task) => ({ ...task }));

        const replaceFromSync = (records = []) => {
            const nextByDate = {};
            records.forEach((record) => {
                if (!record?.id || !record?.dateKey) return;
                if (!nextByDate[record.dateKey]) nextByDate[record.dateKey] = [];
                nextByDate[record.dateKey].push({ ...record });
            });
            writeStored(nextByDate);
            return load();
        };

        const initialize = (legacyTasksByDate = {}) => {
            if (readStored()) return load();
            storage.setItem(BACKUP_KEY, JSON.stringify(legacyTasksByDate));
            const migrated = contract.migrateLegacyTasksByDate(legacyTasksByDate, {
                deviceId,
                now: now()
            });
            writeStored(migrated);
            return load();
        };

        const save = (tasksByDate = {}) => {
            const previousByDate = readStored() || {};
            const previousById = new Map(
                Object.values(previousByDate).flat().map((task) => [String(task.id), task])
            );
            const incomingById = new Map(
                Object.values(tasksByDate).flat().map((task) => [String(task.id), task])
            );
            const timestamp = now();
            const nextByDate = {};

            Object.entries(tasksByDate).forEach(([dateKey, tasks]) => {
                nextByDate[dateKey] = (Array.isArray(tasks) ? tasks : []).map((task) => {
                    const previous = previousById.get(String(task.id));
                    if (previous && sameContent(previous, task)) return previous;
                    const next = contract.createSyncTask(task, {
                        id: task.id,
                        dateKey,
                        deviceId,
                        now: timestamp
                    });
                    next.createdAt = previous?.createdAt || next.createdAt;
                    next.updatedAt = timestamp;
                    next.revision = previous ? Number(previous.revision || 1) + 1 : 1;
                    queue.enqueue({ action: 'upsert', entityType: 'task', entityId: next.id, payload: next });
                    return next;
                });
            });

            previousById.forEach((previous, id) => {
                if (previous.deletedAt || incomingById.has(id)) return;
                const tombstone = contract.markSyncTaskDeleted(previous, { deviceId, now: timestamp });
                if (!nextByDate[tombstone.dateKey]) nextByDate[tombstone.dateKey] = [];
                nextByDate[tombstone.dateKey].push(tombstone);
                queue.enqueue({ action: 'delete', entityType: 'task', entityId: id, payload: tombstone });
            });

            writeStored(nextByDate);
            return load();
        };

        return { initialize, load, loadRecords, replaceFromSync, save };
    };

    return { createLocalTaskRepository };
}));

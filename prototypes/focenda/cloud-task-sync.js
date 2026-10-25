(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaCloudTaskSync = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const SYNC_FIELDS = new Set([
        'schemaVersion', 'entityType', 'id', 'userId', 'dateKey', 'title', 'status',
        'revision', 'deviceId', 'createdAt', 'updatedAt', 'deletedAt'
    ]);

    const safeRevision = (value) => Number.isInteger(value) && value > 0 ? value : 1;
    const safeStatus = (value) => value === 'completed' ? 'completed' : 'pending';
    const safeText = (value) => typeof value === 'string' ? value : '';

    const taskData = (task) => Object.fromEntries(
        Object.entries(task || {}).filter(([key]) => !SYNC_FIELDS.has(key))
    );

    const toCloudTaskRow = (task, userId) => {
        if (!task?.id || !task?.dateKey || !task?.title || !userId) {
            throw new Error('同步任务缺少用户、身份、日期或标题');
        }
        return {
            user_id: String(userId),
            id: String(task.id),
            date_key: task.dateKey,
            title: String(task.title).trim(),
            status: safeStatus(task.status),
            data: taskData(task),
            revision: safeRevision(task.revision),
            device_id: safeText(task.deviceId),
            created_at: safeText(task.createdAt),
            updated_at: safeText(task.updatedAt),
            deleted_at: task.deletedAt || null
        };
    };

    const fromCloudTaskRow = (row) => {
        if (!row?.id || !row?.date_key || !row?.title) throw new Error('云端任务数据不完整');
        return {
            ...(row.data && typeof row.data === 'object' && !Array.isArray(row.data) ? row.data : {}),
            schemaVersion: 1,
            id: String(row.id),
            dateKey: row.date_key,
            title: String(row.title),
            status: safeStatus(row.status),
            revision: safeRevision(row.revision),
            deviceId: safeText(row.device_id),
            createdAt: safeText(row.created_at),
            updatedAt: safeText(row.updated_at),
            deletedAt: row.deleted_at || null
        };
    };

    const compareTaskVersions = (first, second) => {
        const revisionDifference = safeRevision(first?.revision) - safeRevision(second?.revision);
        if (revisionDifference !== 0) return revisionDifference;
        const timeDifference = safeText(first?.updatedAt).localeCompare(safeText(second?.updatedAt));
        if (timeDifference !== 0) return timeDifference;
        return safeText(first?.deviceId).localeCompare(safeText(second?.deviceId));
    };

    const mergeTaskRecords = (localRecords = [], remoteRecords = []) => {
        const byId = new Map();
        [...localRecords, ...remoteRecords].forEach((record) => {
            if (!record?.id || !record?.dateKey) return;
            const current = byId.get(String(record.id));
            if (!current || compareTaskVersions(record, current) > 0) {
                byId.set(String(record.id), { ...record });
            }
        });
        const records = [...byId.values()].sort((first, second) => String(first.id).localeCompare(String(second.id)));
        const visibleByDate = {};
        records.forEach((record) => {
            if (record.deletedAt) return;
            if (!visibleByDate[record.dateKey]) visibleByDate[record.dateKey] = [];
            visibleByDate[record.dateKey].push({ ...record });
        });
        return { records, visibleByDate };
    };

    return { compareTaskVersions, fromCloudTaskRow, mergeTaskRecords, toCloudTaskRow };
}));

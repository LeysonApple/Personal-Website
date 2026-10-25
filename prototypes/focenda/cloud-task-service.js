(function (root, factory) {
    const sync = typeof module === 'object' && module.exports
        ? require('./cloud-task-sync.js')
        : root.FocendaCloudTaskSync;
    const api = factory(sync);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaCloudTaskService = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function (sync) {
    const PAGE_SIZE = 500;

    const errorMessage = (error) => String(error?.message || error || '同步失败');

    const createCloudTaskService = (client, queue) => {
        if (!client?.rpc) throw new Error('Cloud task client is unavailable');

        const syncRecord = async (record, userId) => {
            const { user_id: _ignoredOwner, ...task } = sync.toCloudTaskRow(record, userId);
            const { data, error } = await client.rpc('sync_task', { task });
            if (error) throw new Error(errorMessage(error));
            return sync.fromCloudTaskRow(data);
        };

        const pullAll = async () => {
            if (!client.from) throw new Error('Cloud task reader is unavailable');
            const rows = [];
            for (let start = 0; ; start += PAGE_SIZE) {
                const { data, error } = await client
                    .from('tasks')
                    .select('id,date_key,title,status,data,revision,device_id,created_at,updated_at,deleted_at')
                    .range(start, start + PAGE_SIZE - 1);
                if (error) throw new Error(errorMessage(error));
                const page = Array.isArray(data) ? data : [];
                rows.push(...page);
                if (page.length < PAGE_SIZE) break;
            }
            return rows.map(sync.fromCloudTaskRow);
        };

        const uploadRecords = async (records, userId) => {
            const confirmed = [];
            for (const record of records) confirmed.push(await syncRecord(record, userId));
            return confirmed;
        };

        const flushQueue = async (userId) => {
            const result = { uploaded: 0, failed: 0 };
            const ownerScope = `user:${userId}`;
            for (const operation of queue.listFor(ownerScope).filter((item) => item.entityType === 'task')) {
                try {
                    await syncRecord(operation.payload, userId);
                    queue.acknowledge(operation.operationId);
                    result.uploaded += 1;
                } catch (error) {
                    queue.recordFailure(operation.operationId, errorMessage(error));
                    result.failed += 1;
                }
            }
            return result;
        };

        const mergeFromCloud = async (localRecords) => (
            sync.mergeTaskRecords(localRecords, await pullAll())
        );

        const reconcile = async (localRecords, userId) => {
            const merged = await mergeFromCloud(localRecords);
            const confirmed = await uploadRecords(merged.records, userId);
            return sync.mergeTaskRecords(merged.records, confirmed);
        };

        return { flushQueue, mergeFromCloud, pullAll, reconcile, syncRecord, uploadRecords };
    };

    return { createCloudTaskService };
}));

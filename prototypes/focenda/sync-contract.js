(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaSyncContract = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const SYNC_SCHEMA_VERSION = 1;

    const normalizeStatus = (status) => status === 'completed' ? 'completed' : 'pending';
    const validRevision = (revision) => Number.isInteger(revision) && revision > 0 ? revision : 1;

    const createAccountRecord = (entityType, id, payload, context = {}) => {
        if (!context.userId || !context.deviceId || !context.now) {
            throw new Error('账号同步记录缺少用户、设备或时间信息');
        }
        return {
            ...payload,
            schemaVersion: SYNC_SCHEMA_VERSION,
            entityType,
            id,
            userId: context.userId,
            createdAt: payload.createdAt || context.now,
            updatedAt: payload.updatedAt || context.now,
            deletedAt: payload.deletedAt || null,
            revision: validRevision(payload.revision),
            deviceId: context.deviceId
        };
    };

    const createSyncProfile = (profile = {}, context = {}) => createAccountRecord(
        'profile',
        `${context.userId}:profile`,
        { ...profile, displayName: typeof profile.displayName === 'string' ? profile.displayName.trim() : '' },
        context
    );

    const createSyncSettings = (settings = {}, context = {}) => createAccountRecord(
        'settings',
        `${context.userId}:settings`,
        settings,
        context
    );

    const createSyncSchedule = (schedule = {}, context = {}) => {
        if (!schedule.dateKey || !Array.isArray(schedule.items)) {
            throw new Error('排期同步记录缺少日期或项目列表');
        }
        return createAccountRecord(
            'schedule',
            `${context.userId}:schedule:${schedule.dateKey}`,
            { ...schedule, items: schedule.items.map((item) => ({ ...item })) },
            context
        );
    };

    const createSyncTask = (input = {}, context = {}) => {
        const title = typeof input.title === 'string' ? input.title.trim() : '';
        if (!title) throw new Error('任务标题不能为空');
        if (!context.id || !context.dateKey || !context.deviceId || !context.now) {
            throw new Error('同步任务缺少身份、日期、设备或时间信息');
        }

        return {
            ...input,
            schemaVersion: SYNC_SCHEMA_VERSION,
            id: String(context.id),
            dateKey: context.dateKey,
            title,
            status: normalizeStatus(input.status),
            createdAt: input.createdAt || context.now,
            updatedAt: input.updatedAt || context.now,
            deletedAt: input.deletedAt || null,
            revision: validRevision(input.revision),
            deviceId: context.deviceId
        };
    };

    const migrateLegacyTasksByDate = (tasksByDate = {}, context = {}) => {
        if (!tasksByDate || typeof tasksByDate !== 'object' || Array.isArray(tasksByDate)) return {};

        return Object.fromEntries(Object.entries(tasksByDate).map(([dateKey, tasks]) => [
            dateKey,
            (Array.isArray(tasks) ? tasks : []).map((task, index) => {
                const existingSyncId = task?.schemaVersion === SYNC_SCHEMA_VERSION && typeof task.id === 'string';
                const id = existingSyncId
                    ? task.id
                    : `legacy-${dateKey}-${task?.id ?? index}`;
                return createSyncTask(task, {
                    id,
                    dateKey,
                    deviceId: task?.deviceId || context.deviceId,
                    now: task?.createdAt || context.now
                });
            })
        ]));
    };

    const markSyncTaskDeleted = (task, context = {}) => {
        if (!task?.id || !context.deviceId || !context.now) {
            throw new Error('删除同步任务缺少必要信息');
        }
        return {
            ...task,
            deletedAt: context.now,
            updatedAt: context.now,
            revision: validRevision(task.revision) + 1,
            deviceId: context.deviceId
        };
    };

    return {
        SYNC_SCHEMA_VERSION,
        createSyncProfile,
        createSyncSchedule,
        createSyncSettings,
        createSyncTask,
        migrateLegacyTasksByDate,
        markSyncTaskDeleted
    };
}));

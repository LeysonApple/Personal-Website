(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaOfflineSyncQueue = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const STORAGE_KEY = 'focenda_offline_sync_queue_v1';
    const LOCAL_OWNER_SCOPE = 'local';
    const ALLOWED_ACTIONS = new Set(['upsert', 'delete']);
    const ALLOWED_ENTITIES = new Set(['profile', 'settings', 'task', 'schedule']);
    const normalizeOwnerScope = (value) => (
        value === LOCAL_OWNER_SCOPE || /^user:[A-Za-z0-9_-]{1,128}$/.test(String(value || ''))
            ? String(value)
            : LOCAL_OWNER_SCOPE
    );

    const createOfflineSyncQueue = (storage, options = {}) => {
        const idFactory = options.idFactory || (() => globalThis.crypto.randomUUID());
        const now = options.now || (() => new Date().toISOString());
        let activeOwnerScope = normalizeOwnerScope(options.ownerScope);

        const read = () => {
            try {
                const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
                return Array.isArray(parsed)
                    ? parsed.filter((item) => item?.operationId).map((item) => ({
                        ...item,
                        ownerScope: normalizeOwnerScope(item.ownerScope)
                    }))
                    : [];
            } catch (error) {
                return [];
            }
        };
        const write = (items) => storage.setItem(STORAGE_KEY, JSON.stringify(items));

        const enqueue = (operation = {}) => {
            if (!ALLOWED_ACTIONS.has(operation.action)) throw new Error('不支持的同步操作');
            if (!ALLOWED_ENTITIES.has(operation.entityType)) throw new Error('不支持的同步数据类型');
            if (!operation.entityId) throw new Error('同步操作缺少数据身份');

            const item = {
                operationId: idFactory(),
                action: operation.action,
                entityType: operation.entityType,
                entityId: String(operation.entityId),
                payload: operation.payload ?? null,
                ownerScope: normalizeOwnerScope(operation.ownerScope || activeOwnerScope),
                createdAt: now(),
                attempts: 0,
                lastError: null
            };
            const next = read().filter((queued) => !(
                queued.ownerScope === item.ownerScope
                && queued.entityType === item.entityType
                && queued.entityId === item.entityId
            ));
            next.push(item);
            write(next);
            return item;
        };

        const acknowledge = (operationId) => {
            write(read().filter((item) => item.operationId !== operationId));
        };

        const recordFailure = (operationId, message) => {
            const next = read().map((item) => item.operationId === operationId ? {
                ...item,
                attempts: Number(item.attempts || 0) + 1,
                lastError: String(message || '同步失败').slice(0, 240)
            } : item);
            write(next);
        };

        const bindLocalTo = (ownerScope) => {
            const targetScope = normalizeOwnerScope(ownerScope);
            if (targetScope === LOCAL_OWNER_SCOPE) throw new Error('账号同步范围无效');
            const byEntity = new Map();
            read().forEach((item) => {
                const next = item.ownerScope === LOCAL_OWNER_SCOPE
                    ? { ...item, ownerScope: targetScope }
                    : item;
                byEntity.set(`${next.ownerScope}:${next.entityType}:${next.entityId}`, next);
            });
            write([...byEntity.values()]);
        };

        const discardScope = (ownerScope) => {
            const targetScope = normalizeOwnerScope(ownerScope);
            write(read().filter((item) => item.ownerScope !== targetScope));
        };

        return {
            acknowledge,
            bindLocalTo,
            discardScope,
            enqueue,
            getOwnerScope: () => activeOwnerScope,
            list: () => read().map((item) => ({ ...item })),
            listFor: (ownerScope) => read()
                .filter((item) => item.ownerScope === normalizeOwnerScope(ownerScope))
                .map((item) => ({ ...item })),
            recordFailure,
            setOwnerScope: (ownerScope) => {
                activeOwnerScope = normalizeOwnerScope(ownerScope);
                return activeOwnerScope;
            }
        };
    };

    return { LOCAL_OWNER_SCOPE, createOfflineSyncQueue };
}));

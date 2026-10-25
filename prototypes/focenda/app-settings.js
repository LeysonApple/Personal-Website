(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaAppSettings = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const STORAGE_KEY = 'focenda_app_settings_v1';
    const DEFAULTS = Object.freeze({ defaultStrategy: 'focus' });
    const STRATEGIES = new Set(['focus', 'balanced', 'relaxed']);
    const isSupportedStrategy = (value) => STRATEGIES.has(value);

    const sanitize = (value) => ({
        defaultStrategy: isSupportedStrategy(value?.defaultStrategy)
            ? value.defaultStrategy
            : DEFAULTS.defaultStrategy
    });

    const createAppSettingsStorage = (storage) => ({
        load() {
            try {
                return sanitize(JSON.parse(storage.getItem(STORAGE_KEY) || 'null'));
            } catch (error) {
                return { ...DEFAULTS };
            }
        },
        save(value) {
            const next = sanitize(value);
            storage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        }
    });

    return { DEFAULTS, createAppSettingsStorage, isSupportedStrategy, sanitize };
}));

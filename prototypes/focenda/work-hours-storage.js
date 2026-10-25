(function registerWorkHoursStorage(root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.FocusFlowWorkHoursStorage = api;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function createModule() {
    const STORAGE_KEY = 'focusflow_work_hours_v1';
    const DEFAULT_WORK_HOURS = Object.freeze({
        start: '09:00',
        end: '18:00',
        hasLunch: true,
        lunchStart: '12:00',
        lunchEnd: '13:00'
    });

    const normalize = (value) => ({
        start: typeof value?.start === 'string' ? value.start : DEFAULT_WORK_HOURS.start,
        end: typeof value?.end === 'string' ? value.end : DEFAULT_WORK_HOURS.end,
        hasLunch: typeof value?.hasLunch === 'boolean' ? value.hasLunch : DEFAULT_WORK_HOURS.hasLunch,
        lunchStart: typeof value?.lunchStart === 'string' ? value.lunchStart : DEFAULT_WORK_HOURS.lunchStart,
        lunchEnd: typeof value?.lunchEnd === 'string' ? value.lunchEnd : DEFAULT_WORK_HOURS.lunchEnd
    });

    const createWorkHoursStorage = (storage) => ({
        load() {
            try {
                const saved = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
                return saved && typeof saved === 'object'
                    ? normalize(saved)
                    : { ...DEFAULT_WORK_HOURS };
            } catch (error) {
                return { ...DEFAULT_WORK_HOURS };
            }
        },
        save(workHours) {
            try {
                storage.setItem(STORAGE_KEY, JSON.stringify(normalize(workHours)));
                return true;
            } catch (error) {
                console.error('工作时间保存失败：', error);
                return false;
            }
        }
    });

    return {
        DEFAULT_WORK_HOURS,
        STORAGE_KEY,
        createWorkHoursStorage,
        normalize
    };
}));

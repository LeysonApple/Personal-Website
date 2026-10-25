(function registerScheduleStorage(root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.FocusFlowScheduleStorage = api;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function createModule() {
    const STORAGE_KEY = 'focusflow_dynamic_schedules_v1';

    const getLocalDateKey = (date = new Date()) => {
        const pad = (value) => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const getDateContext = (selectedDate, todayKey = getLocalDateKey()) => {
        const [, month = '', day = ''] = String(selectedDate || '').split('-');
        const isToday = selectedDate === todayKey;
        const dayLabel = isToday ? '今天' : `${Number(month)}月${Number(day)}日`;

        return {
            isToday,
            dayLabel,
            question: isToday ? '今天要完成什么？' : `${dayLabel}要完成什么？`,
            taskHeading: isToday ? '今日任务' : `${dayLabel}任务`,
            generateLabel: isToday ? '生成今日安排' : `生成${dayLabel}安排`,
            loadLabel: isToday ? '今日任务负荷' : `${dayLabel}任务负荷`,
            completionLabel: isToday ? '今天的安排到这里' : `${dayLabel}的安排到这里`
        };
    };

    const createScheduleStorage = (storage, nowProvider = () => new Date()) => {
        const listeners = new Set();
        const notify = (change) => {
            listeners.forEach((listener) => {
                try {
                    listener(change);
                } catch (error) {
                    console.error('动态排期变更通知失败：', error);
                }
            });
        };
        const readSnapshots = () => {
            try {
                const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
                return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
            } catch (error) {
                return {};
            }
        };

        const writeSnapshots = (snapshots) => {
            try {
                storage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
                return true;
            } catch (error) {
                console.error('动态排期保存失败：', error);
                return false;
            }
        };

        const keepCurrentDayOnly = (snapshots) => {
            const today = getLocalDateKey(nowProvider());
            return Object.fromEntries(
                Object.entries(snapshots).filter(([, snapshot]) => snapshot?.generatedOn === today)
            );
        };

        const load = (selectedDate) => {
            const snapshots = readSnapshots();
            const currentSnapshots = keepCurrentDayOnly(snapshots);

            if (Object.keys(currentSnapshots).length !== Object.keys(snapshots).length) {
                writeSnapshots(currentSnapshots);
            }

            return currentSnapshots[selectedDate] || null;
        };

        const save = (selectedDate, snapshot) => {
            const snapshots = keepCurrentDayOnly(readSnapshots());
            snapshots[selectedDate] = {
                ...snapshot,
                generatedOn: getLocalDateKey(nowProvider())
            };
            const saved = writeSnapshots(snapshots);
            if (saved) notify({ type: 'save', selectedDate });
            return saved;
        };

        const remove = (selectedDate) => {
            const snapshots = keepCurrentDayOnly(readSnapshots());
            delete snapshots[selectedDate];
            const saved = writeSnapshots(snapshots);
            if (saved) notify({ type: 'remove', selectedDate });
            return saved;
        };

        const subscribe = (listener) => {
            if (typeof listener !== 'function') throw new TypeError('listener must be a function');
            listeners.add(listener);
            return () => listeners.delete(listener);
        };

        return {
            storageKey: STORAGE_KEY,
            getTodayKey: () => getLocalDateKey(nowProvider()),
            load,
            save,
            remove,
            subscribe
        };
    };

    return {
        STORAGE_KEY,
        createScheduleStorage,
        getDateContext,
        getLocalDateKey
    };
}));

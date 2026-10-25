(function registerBackupEngine(root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.FocusFlowBackupEngine = api;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function createModule() {
    const FORMAT = 'focusflow-backup';
    const VERSION = 1;
    const isDateKey = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
    const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

    const sanitizeTask = (task) => {
        if (!isRecord(task)) throw new TypeError('任务数据无效。');
        if (!['string', 'number'].includes(typeof task.id) || String(task.id).length === 0) {
            throw new TypeError('任务 ID 无效。');
        }
        const title = typeof task.title === 'string' ? task.title.trim() : '';
        if (!title) throw new TypeError('任务标题无效。');
        if (task.durMin !== undefined && (!Number.isFinite(task.durMin) || task.durMin < 10 || task.durMin > 480)) {
            throw new TypeError('任务耗时无效。');
        }

        return { ...task, title };
    };

    const sanitizeTasksByDate = (tasksByDate = {}) => {
        if (!isRecord(tasksByDate)) throw new TypeError('按日期保存的任务数据无效。');
        const sanitized = {};
        for (const [dateKey, tasks] of Object.entries(tasksByDate)) {
            if (!isDateKey(dateKey)) throw new TypeError(`任务日期无效：${dateKey}`);
            if (!Array.isArray(tasks)) throw new TypeError(`日期 ${dateKey} 的任务列表无效。`);
            sanitized[dateKey] = tasks.map(sanitizeTask);
        }
        return sanitized;
    };

    const sanitizeWorkHours = (workHours) => {
        if (!isRecord(workHours)) return null;
        const fields = ['start', 'end', 'hasLunch', 'lunchStart', 'lunchEnd'];
        return Object.fromEntries(fields.filter((field) => field in workHours).map(
            (field) => [field, workHours[field]]
        ));
    };

    const createBackup = (state = {}, createdAt = new Date().toISOString()) => ({
        format: FORMAT,
        version: VERSION,
        createdAt,
        data: {
            tasksByDate: sanitizeTasksByDate(state.tasksByDate || {}),
            workHours: sanitizeWorkHours(state.workHours)
        }
    });

    const parseBackup = (input) => {
        let raw = input;
        if (typeof input === 'string') {
            try {
                raw = JSON.parse(input);
            } catch (error) {
                throw new SyntaxError('备份文件不是有效的 JSON。');
            }
        }
        if (!isRecord(raw) || raw.format !== FORMAT) throw new TypeError('这不是 Focenda 可识别的备份。');
        if (raw.version !== VERSION) throw new RangeError('不支持这个备份版本。');
        if (!isRecord(raw.data)) throw new TypeError('备份内容缺失。');

        return {
            format: FORMAT,
            version: VERSION,
            createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : null,
            data: {
                tasksByDate: sanitizeTasksByDate(raw.data.tasksByDate || {}),
                workHours: sanitizeWorkHours(raw.data.workHours)
            }
        };
    };

    const summarizeBackup = (backup) => {
        const tasksByDate = backup?.data?.tasksByDate || {};
        const tasks = Object.values(tasksByDate).flat();
        return {
            dateCount: Object.keys(tasksByDate).length,
            taskCount: tasks.length,
            completedCount: tasks.filter((task) => task.status === 'completed').length
        };
    };

    const applyBackupTasks = (currentTasks, incomingTasks, mode) => {
        const incoming = sanitizeTasksByDate(incomingTasks);
        if (mode === 'replace') return incoming;
        if (mode !== 'merge') throw new RangeError('未知的恢复方式。');

        const result = sanitizeTasksByDate(currentTasks);
        for (const [dateKey, tasks] of Object.entries(incoming)) {
            const existing = result[dateKey] || [];
            const ids = new Set(existing.map((task) => String(task.id)));
            result[dateKey] = [
                ...existing,
                ...tasks.filter((task) => !ids.has(String(task.id)))
            ];
        }
        return result;
    };

    const readStoredTasks = (serialized, fallbackDate) => {
        const fallback = { [fallbackDate]: [] };
        if (typeof serialized !== 'string' || serialized.length === 0) return fallback;
        try {
            return sanitizeTasksByDate(JSON.parse(serialized));
        } catch (error) {
            return fallback;
        }
    };

    return {
        FORMAT,
        VERSION,
        applyBackupTasks,
        createBackup,
        parseBackup,
        readStoredTasks,
        summarizeBackup
    };
}));

(function registerTaskLifecycle(root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.FocusFlowTaskLifecycle = api;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function createModule() {
    const getTaskStatus = (task) => (
        task?.status === 'completed' ? 'completed' : 'pending'
    );

    const updateTask = (tasks, taskId, updater) => {
        let found = false;
        const updated = tasks.map((task) => {
            if (task.id !== taskId) return task;
            found = true;
            return updater(task);
        });
        return found ? updated : tasks;
    };

    const completeTask = (tasks, taskId, completedAt = new Date().toISOString()) => (
        updateTask(tasks, taskId, (task) => ({
            ...task,
            status: 'completed',
            completedAt
        }))
    );

    const reopenTask = (tasks, taskId) => (
        updateTask(tasks, taskId, (task) => ({
            ...task,
            status: 'pending',
            completedAt: null
        }))
    );

    const getPendingTasks = (tasks = []) => tasks.filter(
        (task) => getTaskStatus(task) === 'pending'
    );

    const editTask = (tasks, taskId, changes = {}) => {
        const nextChanges = {};

        if (Object.hasOwn(changes, 'title')) {
            const title = String(changes.title || '').trim();
            if (!title) throw new RangeError('任务标题不能为空。');
            nextChanges.title = title;
        }

        if (Object.hasOwn(changes, 'durMin')) {
            const duration = Number(changes.durMin);
            if (!Number.isFinite(duration) || duration < 10 || duration > 480) {
                throw new RangeError('任务耗时需要在 10 到 480 分钟之间。');
            }
            nextChanges.durMin = Math.round(duration);
        }

        if (Object.hasOwn(changes, 'reminderMinutes')) {
            const reminder = changes.reminderMinutes;
            const allowed = [null, 0, 10, 30, 60];
            if (!allowed.includes(reminder)) throw new RangeError('提醒时间无效。');
            nextChanges.reminderMinutes = reminder;
        }

        for (const field of ['timeMode', 'fixedSTime', 'fixedETime', 'recurrence']) {
            if (Object.hasOwn(changes, field)) nextChanges[field] = changes[field];
        }

        return updateTask(tasks, taskId, (task) => ({ ...task, ...nextChanges }));
    };

    const isDateKey = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));

    const getNextDateKey = (dateKey) => {
        if (!isDateKey(dateKey)) throw new RangeError('日期无效。');
        const [year, month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);
        const pad = (value) => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const moveTaskToDate = (tasksByDate, taskId, sourceDate, targetDate) => {
        if (!isDateKey(targetDate)) throw new RangeError('目标日期无效。');
        if (sourceDate === targetDate) throw new RangeError('请选择其他日期。');

        const sourceTasks = tasksByDate[sourceDate] || [];
        const task = sourceTasks.find((item) => item.id === taskId);
        if (!task) return tasksByDate;

        return {
            ...tasksByDate,
            [sourceDate]: sourceTasks.filter((item) => item.id !== taskId),
            [targetDate]: [...(tasksByDate[targetDate] || []), task]
        };
    };

    const getOverduePendingTasks = (tasksByDate = {}, today) => {
        if (!isDateKey(today)) throw new RangeError('今天的日期无效。');

        return Object.keys(tasksByDate)
            .filter((date) => isDateKey(date) && date < today)
            .sort()
            .flatMap((date) => getPendingTasks(tasksByDate[date]).map((task) => ({
                date,
                task
            })));
    };

    const carryOverPendingTasks = (tasksByDate = {}, today) => {
        const overdueTasks = getOverduePendingTasks(tasksByDate, today);
        if (overdueTasks.length === 0) return tasksByDate;

        const overdueDates = new Set(overdueTasks.map((item) => item.date));
        const nextTasksByDate = { ...tasksByDate };

        for (const date of overdueDates) {
            nextTasksByDate[date] = (tasksByDate[date] || []).filter(
                (task) => getTaskStatus(task) === 'completed'
            );
        }

        nextTasksByDate[today] = [
            ...(tasksByDate[today] || []),
            ...overdueTasks.map(({ date, task }) => ({
                ...task,
                status: 'pending',
                completedAt: null,
                carriedFrom: task.carriedFrom || date
            }))
        ];

        return nextTasksByDate;
    };

    const getWeekday = (dateKey) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month - 1, day).getDay();
    };

    const materializeRecurringTasks = (tasksByDate = {}, targetDate) => {
        if (!isDateKey(targetDate)) throw new RangeError('目标日期无效。');

        const targetWeekday = getWeekday(targetDate);
        const isTargetWeekday = targetWeekday >= 1 && targetWeekday <= 5;
        const targetTasks = tasksByDate[targetDate] || [];
        const existingSources = new Set(targetTasks.map(
            (task) => task.recurrenceSourceId || task.id
        ));
        const occurrences = [];

        const sourceDates = Object.keys(tasksByDate)
            .filter((date) => isDateKey(date) && date < targetDate)
            .sort()
            .reverse();

        for (const date of sourceDates) {
            for (const task of tasksByDate[date] || []) {
                const sourceId = task.recurrenceSourceId || task.id;
                if (existingSources.has(sourceId)) continue;

                const matches = task.recurrence === 'daily'
                    || (task.recurrence === 'weekdays' && isTargetWeekday)
                    || (task.recurrence === 'weekly' && getWeekday(date) === targetWeekday);
                if (!matches) continue;

                existingSources.add(sourceId);
                occurrences.push({
                    ...task,
                    id: `recurring-${sourceId}-${targetDate}`,
                    status: 'pending',
                    completedAt: null,
                    recurrenceSourceId: sourceId,
                    recurrenceDate: targetDate
                });
            }
        }

        if (occurrences.length === 0) return tasksByDate;
        return {
            ...tasksByDate,
            [targetDate]: [...targetTasks, ...occurrences]
        };
    };

    return {
        carryOverPendingTasks,
        completeTask,
        editTask,
        getOverduePendingTasks,
        getPendingTasks,
        getNextDateKey,
        getTaskStatus,
        materializeRecurringTasks,
        moveTaskToDate,
        reopenTask
    };
}));

(function registerReminderEngine(root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.FocusFlowReminderEngine = api;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function createModule() {
    const isDateKey = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
    const isTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''));

    const getReminderKey = (dateKey, task) => (
        `${dateKey}:${task.recurrenceSourceId || task.id}:${task.fixedSTime}:${task.reminderMinutes}`
    );

    const getScheduledTime = (dateKey, time) => {
        const [year, month, day] = dateKey.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute);
    };

    const getDueReminders = (tasksByDate = {}, now = new Date(), notifiedKeys = []) => {
        const notified = new Set(notifiedKeys);
        const due = [];

        for (const [dateKey, tasks] of Object.entries(tasksByDate)) {
            if (!isDateKey(dateKey)) continue;
            for (const task of tasks || []) {
                if (task?.status === 'completed') continue;
                if (!isTime(task?.fixedSTime)) continue;
                if (!Number.isFinite(task?.reminderMinutes) || task.reminderMinutes < 0) continue;

                const key = getReminderKey(dateKey, task);
                if (notified.has(key)) continue;

                const scheduledAt = getScheduledTime(dateKey, task.fixedSTime);
                const triggerAt = new Date(scheduledAt.getTime() - task.reminderMinutes * 60 * 1000);
                const expiresAt = new Date(scheduledAt.getTime() + 60 * 60 * 1000);
                if (now < triggerAt || now > expiresAt) continue;

                due.push({ key, dateKey, task, scheduledAt });
            }
        }

        return due.sort((a, b) => a.scheduledAt - b.scheduledAt);
    };

    return {
        getDueReminders,
        getReminderKey
    };
}));

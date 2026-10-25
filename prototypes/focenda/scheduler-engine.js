(function registerSchedulerEngine(root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }

    if (root) {
        root.FocusFlowSchedulerEngine = api;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function createModule() {
    const parseTime = (time = '00:00') => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const formatTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const isValidTime = (time) => (
        typeof time === 'string'
        && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)
    );

    const validateWorkHours = (workHours = {}) => {
        if (!isValidTime(workHours.start) || !isValidTime(workHours.end)) {
            return { valid: false, availableMinutes: 0, message: '请填写完整的工作时间。' };
        }

        const start = parseTime(workHours.start);
        const end = parseTime(workHours.end);
        if (end <= start) {
            return { valid: false, availableMinutes: 0, message: '结束时间必须晚于开始时间。' };
        }

        if (!workHours.hasLunch) {
            return { valid: true, availableMinutes: end - start, message: '' };
        }

        if (!isValidTime(workHours.lunchStart) || !isValidTime(workHours.lunchEnd)) {
            return { valid: false, availableMinutes: 0, message: '请填写完整的午休时间。' };
        }

        const lunchStart = parseTime(workHours.lunchStart);
        const lunchEnd = parseTime(workHours.lunchEnd);
        if (lunchEnd <= lunchStart) {
            return { valid: false, availableMinutes: 0, message: '午休结束时间必须晚于开始时间。' };
        }
        if (lunchStart < start || lunchEnd > end) {
            return { valid: false, availableMinutes: 0, message: '午休时间需要位于工作时间内。' };
        }

        return {
            valid: true,
            availableMinutes: end - start - (lunchEnd - lunchStart),
            message: ''
        };
    };

    const chineseDigitValues = {
        '零': 0,
        '〇': 0,
        '一': 1,
        '二': 2,
        '两': 2,
        '三': 3,
        '四': 4,
        '五': 5,
        '六': 6,
        '七': 7,
        '八': 8,
        '九': 9
    };

    const parseNaturalNumber = (value) => {
        const text = String(value || '').trim();
        if (!text) return NaN;
        if (/^\d+(?:\.\d+)?$/.test(text)) return Number(text);
        if (text === '十') return 10;
        if (text.includes('十')) {
            const [tensText, unitsText] = text.split('十');
            const tens = tensText ? chineseDigitValues[tensText] : 1;
            const units = unitsText ? chineseDigitValues[unitsText] : 0;
            return Number.isFinite(tens) && Number.isFinite(units) ? tens * 10 + units : NaN;
        }
        if ([...text].every((character) => character in chineseDigitValues)) {
            return Number([...text].map((character) => chineseDigitValues[character]).join(''));
        }
        return NaN;
    };

    const normalizeNaturalTimeText = (title) => String(title || '')
        .replace(/[０-９]/g, (character) => String(character.charCodeAt(0) - 65296))
        .replace(/[：]/g, ':')
        .replace(/[－—–]/g, '-');

    const durationNumberPattern = '[0-9]+(?:\\.[0-9]+)?|[零〇一二两三四五六七八九十]+';

    const inferDurationFromTitle = (title) => {
        const text = normalizeNaturalTimeText(title);
        const halfHourMatch = text.match(new RegExp(`(${durationNumberPattern})?\\s*个?半小时`));
        if (halfHourMatch) {
            const hours = halfHourMatch[1] ? parseNaturalNumber(halfHourMatch[1]) : 0;
            const duration = Math.round((hours + 0.5) * 60);
            return duration >= 10 && duration <= 480 ? duration : null;
        }

        const hourMatch = text.match(new RegExp(`(${durationNumberPattern})\\s*个?小时(?:\\s*(${durationNumberPattern})\\s*分钟?)?`));
        if (hourMatch) {
            const hours = parseNaturalNumber(hourMatch[1]);
            const minutes = hourMatch[2] ? parseNaturalNumber(hourMatch[2]) : 0;
            const duration = Math.round(hours * 60 + minutes);
            return duration >= 10 && duration <= 480 ? duration : null;
        }

        const minutePattern = new RegExp(`(${durationNumberPattern})\\s*(?:分钟|min(?:ute)?s?)`, 'gi');
        for (const match of text.matchAll(minutePattern)) {
            const previousCharacter = match.index > 0 ? text[match.index - 1] : '';
            if (['点', '时', ':'].includes(previousCharacter)) continue;
            const duration = Math.round(parseNaturalNumber(match[1]));
            return duration >= 10 && duration <= 480 ? duration : null;
        }
        return null;
    };

    const timePeriodPattern = '凌晨|早上|早晨|上午|中午|下午|傍晚|晚上|今晚';
    const timeHourPattern = '[0-9]{1,2}|[零〇一二两三四五六七八九十]{1,3}';
    const timeMinutePattern = '[0-5]?[0-9]|[零〇一二两三四五六七八九十]{1,3}';
    const timeExpressionPattern = `(?:(?:${timePeriodPattern})\\s*)?(?:${timeHourPattern})(?::(?:${timeMinutePattern})|(?:点|时)(?:(?:${timeMinutePattern})分?|半)?)`;

    const parseNaturalTimeExpression = (expression, inheritedPeriod = '') => {
        const match = normalizeNaturalTimeText(expression).match(new RegExp(`^(?:(${timePeriodPattern})\\s*)?(${timeHourPattern})(?::(${timeMinutePattern})|(?:点|时)(?:(${timeMinutePattern})分?|(半))?)$`));
        if (!match) return null;

        const period = match[1] || inheritedPeriod;
        let hours = parseNaturalNumber(match[2]);
        const minutes = match[5] ? 30 : (match[3] || match[4] ? parseNaturalNumber(match[3] || match[4]) : 0);
        if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes > 59) return null;

        if (['凌晨', '早上', '早晨', '上午'].includes(period) && hours === 12) hours = 0;
        if (period === '中午' && hours < 11) hours += 12;
        if (['下午', '傍晚', '晚上', '今晚'].includes(period) && hours < 12) hours += 12;
        if (hours < 0 || hours > 23) return null;

        return { minutes: hours * 60 + minutes, period };
    };

    const inferTaskTimingFromTitle = (title, fallbackDuration = 30) => {
        const text = normalizeNaturalTimeText(title);
        const explicitDuration = inferDurationFromTitle(text);
        const rangeMatch = text.match(new RegExp(`(${timeExpressionPattern})\\s*(?:到|至|-|~|～)\\s*(${timeExpressionPattern})`));

        if (rangeMatch) {
            const start = parseNaturalTimeExpression(rangeMatch[1]);
            const end = parseNaturalTimeExpression(rangeMatch[2], start?.period || '');
            if (!start || !end) return null;
            const duration = end.minutes - start.minutes;
            if (duration < 10 || duration > 480) return null;
            return {
                durMin: duration,
                fixedSTime: formatTime(start.minutes),
                fixedETime: formatTime(end.minutes),
                timeMode: 'fixed'
            };
        }

        const startMatch = text.match(new RegExp(timeExpressionPattern));
        if (startMatch) {
            const start = parseNaturalTimeExpression(startMatch[0]);
            const duration = explicitDuration || Math.max(10, Math.min(480, Number(fallbackDuration) || 30));
            const end = start ? start.minutes + duration : 24 * 60;
            if (!start || end >= 24 * 60) return null;
            return {
                durMin: duration,
                fixedSTime: formatTime(start.minutes),
                fixedETime: formatTime(end),
                timeMode: 'fixed'
            };
        }

        if (!explicitDuration) return null;
        return {
            durMin: explicitDuration,
            fixedSTime: '',
            fixedETime: '',
            timeMode: 'duration'
        };
    };

    const inferFixedWindowFromTitle = (title, duration = 30) => {
        const timing = inferTaskTimingFromTitle(title, duration);
        if (!timing?.fixedSTime || !timing?.fixedETime) return null;
        return {
            fixedSTime: timing.fixedSTime,
            fixedETime: timing.fixedETime,
            timeMode: timing.timeMode
        };
    };

    const getScheduleStatus = (schedule = [], workHoursEnd = '18:00') => {
        const workEnd = parseTime(workHoursEnd);
        const hasOvertime = schedule.some(
            (item) => !item.isBreak && parseTime(item.eTime) > workEnd
        );
        return hasOvertime ? `${workHoursEnd} 后超时` : '稳健';
    };

    const getScheduleSummary = (schedule = [], workHours = {}, dayLabel = '今天') => {
        const tasks = schedule.filter((item) => item && !item.isBreak);
        const totalEffort = tasks.reduce(
            (total, item) => total + Math.max(0, Number(item.durMin) || 0),
            0
        );
        const validation = validateWorkHours(workHours);
        const loadScore = validation.valid
            ? Math.min(100, Math.round((totalEffort / Math.max(1, validation.availableMinutes)) * 100))
            : 0;

        let durationText = '';
        if (totalEffort < 60) {
            durationText = `${totalEffort} 分钟`;
        } else {
            const hours = Math.floor(totalEffort / 60);
            const minutes = totalEffort % 60;
            durationText = minutes > 0 ? `${hours} 小时 ${minutes} 分钟` : `${hours} 小时`;
        }

        return {
            taskCount: tasks.length,
            totalEffort,
            insight: tasks.length > 0
                ? `${dayLabel}已离线安排 ${tasks.length} 项任务，预计需要 ${durationText}。可继续拖动或点按调整顺序。`
                : '',
            loadScore,
            status: getScheduleStatus(tasks, workHours.end)
        };
    };

    const sortByStartTime = (schedule) => [...schedule].sort(
        (first, second) => parseTime(first.sTime) - parseTime(second.sTime)
    );

    const hasFixedWindow = (task) => (
        Boolean(task.fixedSTime && task.fixedETime)
        && parseTime(task.fixedETime) > parseTime(task.fixedSTime)
    );

    const getScheduleMoveContext = (schedule, taskId, direction) => {
        if (!Array.isArray(schedule) || ![-1, 1].includes(direction)) return null;

        const tasks = schedule.filter((item) => item && !item.isBreak);
        const movablePositions = [];
        tasks.forEach((item, index) => {
            if (!hasFixedWindow(item)) movablePositions.push(index);
        });

        const movableIndex = movablePositions.findIndex(
            (position) => String(tasks[position].id) === String(taskId)
        );
        const targetMovableIndex = movableIndex + direction;
        if (
            movableIndex < 0
            || targetMovableIndex < 0
            || targetMovableIndex >= movablePositions.length
        ) return null;

        return {
            tasks,
            sourcePosition: movablePositions[movableIndex],
            targetPosition: movablePositions[targetMovableIndex]
        };
    };

    const canMoveScheduleTask = (schedule, taskId, direction) => (
        Boolean(getScheduleMoveContext(schedule, taskId, direction))
    );

    const moveScheduleTask = (schedule, taskId, direction) => {
        const context = getScheduleMoveContext(schedule, taskId, direction);
        if (!context) return null;

        const nextTasks = [...context.tasks];
        [nextTasks[context.sourcePosition], nextTasks[context.targetPosition]] = [
            nextTasks[context.targetPosition],
            nextTasks[context.sourcePosition]
        ];
        return nextTasks;
    };

    const createLunchBreak = (workHours) => {
        if (!workHours.hasLunch) return null;

        const start = parseTime(workHours.lunchStart || '12:00');
        const end = parseTime(workHours.lunchEnd || '13:00');

        return {
            block: { start, end },
            task: {
                id: 'system-lunch-break',
                title: '午休时间 / 严格锁定',
                keyword: '午休',
                durMin: end - start,
                impact: 0,
                effort: 0,
                type: '系统调度',
                user: '系统',
                sTime: formatTime(start),
                eTime: formatTime(end),
                isOvertime: false,
                aiRationale: '系统级不可拖拽时段',
                isBreak: true
            }
        };
    };

    const findAvailableStart = (initialStart, duration, scheduledBlocks) => {
        let taskStart = initialStart;

        while (true) {
            const taskEnd = taskStart + duration;
            const overlap = scheduledBlocks.find(
                (block) => taskStart < block.end && taskEnd > block.start
            );

            if (!overlap) return taskStart;
            taskStart = overlap.end;
        }
    };

    const buildSchedule = ({
        tasks,
        workHours,
        strategy = 'focus',
        preserveOrder = false,
        rationaleById = {},
        fixedTaskRationale = '用户锁定时间',
        defaultRationale = '已按当前节奏安排'
    }) => {
        const validation = validateWorkHours(workHours);
        if (!validation.valid) throw new RangeError(validation.message);

        const workStart = parseTime(workHours.start);
        const workEnd = parseTime(workHours.end);
        const gap = strategy === 'focus' ? 0 : 15;
        const schedule = [];
        const fixedBlocks = [];
        let totalEffort = 0;

        const lunchBreak = createLunchBreak(workHours);
        if (lunchBreak) {
            fixedBlocks.push(lunchBreak.block);
            schedule.push(lunchBreak.task);
        }

        const realTasks = tasks.filter((task) => !task.isBreak);

        for (const currentTask of realTasks.filter(hasFixedWindow)) {
            const start = parseTime(currentTask.fixedSTime);
            const end = parseTime(currentTask.fixedETime);
            const duration = end - start;

            fixedBlocks.push({ start, end });
            totalEffort += duration;
            schedule.push({
                ...currentTask,
                sTime: currentTask.fixedSTime,
                eTime: currentTask.fixedETime,
                durMin: duration,
                isOvertime: end > workEnd,
                aiRationale: fixedTaskRationale
            });
        }

        const scheduledBlocks = fixedBlocks
            .map((block) => ({ ...block, end: block.end + gap }))
            .sort((first, second) => first.start - second.start);
        let sequentialStart = workStart;

        for (const currentTask of realTasks.filter((task) => !hasFixedWindow(task))) {
            const duration = currentTask.durMin || Math.max(30, Math.round((currentTask.effort / 100) * 120));
            const initialStart = preserveOrder ? sequentialStart : workStart;
            const start = findAvailableStart(initialStart, duration, scheduledBlocks);
            const end = start + duration;

            totalEffort += duration;
            schedule.push({
                ...currentTask,
                sTime: formatTime(start),
                eTime: formatTime(end),
                durMin: duration,
                isOvertime: end > workEnd,
                aiRationale: rationaleById[currentTask.id] || defaultRationale
            });

            scheduledBlocks.push({ start, end: end + gap });
            scheduledBlocks.sort((first, second) => first.start - second.start);
            if (preserveOrder) sequentialStart = end + gap;
        }

        return {
            schedule: sortByStartTime(schedule),
            totalEffort
        };
    };

    return {
        buildSchedule,
        canMoveScheduleTask,
        formatTime,
        getScheduleSummary,
        getScheduleStatus,
        inferFixedWindowFromTitle,
        inferTaskTimingFromTitle,
        moveScheduleTask,
        parseTime,
        sortByStartTime,
        validateWorkHours
    };
}));

(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaLocalIntelligence = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const includesAny = (text, words) => words.some((word) => text.includes(word));

    const stableJitter = (text, salt) => {
        let hash = 2166136261;
        const input = `${salt}:${text}`;
        for (let index = 0; index < input.length; index += 1) {
            hash ^= input.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return (Math.abs(hash) % 15) - 7;
    };

    const analyzeTaskValues = (input) => {
        const text = typeof input === 'string' ? input.trim() : '';
        let impact = 40;
        let effort = 40;
        const highImpactWords = ['架构', '核心', '规划', '战略', '重构', '指标', 'KPI', '增长', '大单', '复盘', '重要', '规范', '大屏', '体验升级', '提炼', '起草', '计划表'];
        const lowImpactWords = ['格式', '整理', 'PPT', '跑腿', '报销', '琐事', '开会', '周报', '帮忙', '错别字', '素材', '换个颜色', '封面', '简单', '看一眼'];
        const highEffortWords = ['重构', '开发', '全部', '几百个', '加班', '紧急', '马上', '晚上', '立刻', '改版', '导出成SVG', '推翻', '遗留', '深度复盘'];
        const lowEffortWords = ['草拟', '快速', '提纲', '整理', '复制', '顺便', '一会', '顺手', '修个'];

        highImpactWords.forEach((word) => { if (text.includes(word)) impact += 25; });
        lowImpactWords.forEach((word) => { if (text.includes(word)) impact -= 20; });
        highEffortWords.forEach((word) => { if (text.includes(word)) effort += 25; });
        lowEffortWords.forEach((word) => { if (text.includes(word)) effort -= 20; });

        impact = Math.max(10, Math.min(95, impact + stableJitter(text, 'impact')));
        effort = Math.max(10, Math.min(95, effort + stableJitter(text, 'effort')));

        const hasExternalPressure = includesAny(text, ['CEO', '老板', '投资人', 'Deck']);
        if (hasExternalPressure) impact = 95;

        const isInvisible = includesAny(text, ['顺便', '口头', '帮忙', '答疑', '对齐', '同步', '问一下']);
        const portrait = {
            value: impact > 70 ? { label: '很重要', state: 'creative' } : (impact < 30 ? { label: '较低优先', state: 'survival' } : { label: '一般重要', state: 'routine' }),
            motivation: includesAny(text, ['产品', '核心', '规范']) ? { label: '主动推进', state: 'creative' } : (includesAny(text, ['老板', '支援']) ? { label: '外部推动', state: 'warning' } : { label: '按计划进行', state: 'routine' }),
            cognitive: effort > 70 ? { label: '需要专注', state: 'creative' } : (effort < 30 ? { label: '轻松处理', state: 'routine' } : { label: '适度投入', state: 'routine' }),
            elasticity: includesAny(text, ['紧急', '立刻']) || hasExternalPressure ? { label: '时间较紧', state: 'survival' } : { label: '时间灵活', state: 'routine' },
            resistance: includesAny(text, ['跨组', '开发', '技术']) ? { label: '需要协作', state: 'warning' } : { label: '独立完成', state: 'routine' },
            standard: includesAny(text, ['规范', '标准', '库', '对齐']) ? { label: '要求清晰', state: 'creative' } : { label: '需要确认', state: 'warning' }
        };

        return { impact: Math.round(impact), effort: Math.round(effort), portrait, isInvisible };
    };

    return { analyzeTaskValues };
}));

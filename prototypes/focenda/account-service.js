(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.FocendaAccountService = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const DESKTOP_AUTH_REDIRECT_URL = 'focenda://auth/callback';
    const WEB_AUTH_CALLBACK_PATH = '/auth/callback';

    const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

    const validateCredentials = (email, password) => {
        if (!EMAIL_PATTERN.test(normalizeEmail(email))) return '请输入正确的邮箱地址。';
        return validatePassword(password);
    };

    const validatePassword = (password) => {
        if (String(password || '').length < 8) return '密码至少需要 8 位。';
        if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return '密码需要同时包含字母和数字。';
        return '';
    };

    const friendlyMessage = (error) => {
        const message = String(error?.message || error || '').toLowerCase();
        if (message.includes('invalid login credentials')) return '邮箱或密码不正确。';
        if (message.includes('email not confirmed')) return '请先打开验证邮件完成确认。';
        if (message.includes('expired') || message.includes('invalid token') || message.includes('invalid link')) return '这个账号链接无效或已经过期。';
        if (message.includes('already registered') || message.includes('user already exists')) return '这个邮箱已经注册，可以直接登录。';
        if (message.includes('password')) return '密码不符合要求，请使用至少 8 位字母和数字。';
        if (message.includes('fetch') || message.includes('network')) return '暂时无法连接网络，请稍后重试。本地功能仍可使用。';
        return '操作没有完成，请稍后重试。';
    };

    const unwrap = async (operation) => {
        try {
            const result = await operation;
            if (result?.error) throw result.error;
            return result?.data;
        } catch (error) {
            throw new Error(friendlyMessage(error));
        }
    };

    const resolveAuthRedirectUrl = (options = {}) => {
        if (options.redirectUrl) return String(options.redirectUrl);
        const runtimeLocation = options.location
            || (typeof globalThis !== 'undefined' ? globalThis.location : null);
        const href = typeof runtimeLocation === 'string'
            ? runtimeLocation
            : runtimeLocation?.href;
        try {
            const currentUrl = new URL(href);
            if (currentUrl.protocol === 'https:') {
                return new URL(WEB_AUTH_CALLBACK_PATH, currentUrl.origin).href;
            }
        } catch {
            // A missing or non-web location is the packaged desktop runtime.
        }
        return DESKTOP_AUTH_REDIRECT_URL;
    };

    const isTrustedCallbackUrl = (candidate, redirectUrl) => {
        try {
            const parsed = new URL(candidate);
            const expected = new URL(redirectUrl);
            if (expected.protocol === 'https:') {
                return parsed.protocol === 'https:'
                    && parsed.origin === expected.origin
                    && parsed.pathname === expected.pathname
                    && !parsed.username
                    && !parsed.password;
            }
            return parsed.protocol === expected.protocol
                && parsed.hostname === expected.hostname
                && parsed.port === expected.port
                && parsed.pathname === expected.pathname
                && !parsed.username
                && !parsed.password;
        } catch {
            return false;
        }
    };

    const runAccountMigrationTransaction = async ({
        mode,
        userId,
        localRecords = [],
        queue,
        cloudTaskService,
        applyRecords,
        rollbackRecords
    } = {}) => {
        if (!['merge', 'cloud'].includes(mode)) throw new Error('账号同步方式无效');
        if (!userId) throw new Error('账号同步身份无效');
        if (!queue || typeof applyRecords !== 'function') throw new Error('账号同步组件不可用');

        let result;
        if (mode === 'merge') {
            if (typeof cloudTaskService?.reconcile !== 'function' || typeof queue.bindLocalTo !== 'function') {
                throw new Error('账号同步组件不可用');
            }
            result = await cloudTaskService.reconcile(localRecords, userId);
        } else {
            if (typeof cloudTaskService?.pullAll !== 'function' || typeof queue.discardScope !== 'function') {
                throw new Error('账号同步组件不可用');
            }
            result = { records: await cloudTaskService.pullAll() };
        }

        if (!Array.isArray(result?.records)) throw new Error('账号同步返回的数据无效');

        let applyAttempted = false;
        try {
            applyAttempted = true;
            const visibleRecords = await applyRecords(result.records);
            if (mode === 'merge') queue.bindLocalTo(`user:${userId}`);
            else queue.discardScope('local');
            return { ...result, visibleRecords };
        } catch (error) {
            if (applyAttempted && typeof rollbackRecords === 'function') {
                try {
                    await rollbackRecords(localRecords);
                } catch {
                    // Preserve the original migration error for the retry UI.
                }
            }
            throw error;
        }
    };

    const createAccountService = (client, options = {}) => {
        if (!client?.auth) throw new Error('Account client is unavailable');
        const redirectUrl = resolveAuthRedirectUrl(options);

        return {
            async signUp({ email, password, displayName }) {
                const validationError = validateCredentials(email, password);
                if (validationError) throw new Error(validationError);
                return unwrap(client.auth.signUp({
                    email: normalizeEmail(email),
                    password,
                    options: {
                        data: { display_name: String(displayName || '').trim().slice(0, 80) },
                        emailRedirectTo: redirectUrl
                    }
                }));
            },
            async signIn({ email, password }) {
                const validationError = validateCredentials(email, password);
                if (validationError) throw new Error(validationError);
                return unwrap(client.auth.signInWithPassword({
                    email: normalizeEmail(email),
                    password
                }));
            },
            async sendPasswordReset(email) {
                if (!EMAIL_PATTERN.test(normalizeEmail(email))) throw new Error('请输入正确的邮箱地址。');
                return unwrap(client.auth.resetPasswordForEmail(normalizeEmail(email), { redirectTo: redirectUrl }));
            },
            async signOut() {
                return unwrap(client.auth.signOut());
            },
            async getSession() {
                const data = await unwrap(client.auth.getSession());
                return data?.session || null;
            },
            subscribe(listener) {
                return client.auth.onAuthStateChange((_event, session) => listener(session)).data.subscription;
            },
            async completeAuthCallback(callbackUrl) {
                let parsed;
                try {
                    parsed = new URL(callbackUrl);
                } catch {
                    throw new Error('这个账号链接无效或已经过期。');
                }
                if (!isTrustedCallbackUrl(parsed.href, redirectUrl)) {
                    throw new Error('这个账号链接无效或已经过期。');
                }
                const hash = new URLSearchParams(parsed.hash.replace(/^#/, ''));
                const errorDescription = parsed.searchParams.get('error_description') || hash.get('error_description');
                if (errorDescription) throw new Error(friendlyMessage(errorDescription));
                const code = parsed.searchParams.get('code');
                if (code) {
                    const data = await unwrap(client.auth.exchangeCodeForSession(code));
                    return { ...data, type: parsed.searchParams.get('type') || 'callback' };
                }
                const accessToken = hash.get('access_token');
                const refreshToken = hash.get('refresh_token');
                if (!accessToken || !refreshToken) throw new Error('这个账号链接无效或已经过期。');
                const data = await unwrap(client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }));
                return { ...data, type: hash.get('type') || 'callback' };
            },
            async updatePassword(password) {
                const validationError = validatePassword(password);
                if (validationError) throw new Error(validationError);
                return unwrap(client.auth.updateUser({ password }));
            },
            async deleteAccount() {
                const data = await unwrap(client.functions.invoke('delete-account', { method: 'POST' }));
                await unwrap(client.auth.signOut({ scope: 'local' }));
                return data;
            }
        };
    };

    return {
        createAccountService,
        friendlyMessage,
        isTrustedCallbackUrl,
        normalizeEmail,
        resolveAuthRedirectUrl,
        runAccountMigrationTransaction,
        validateCredentials,
        validatePassword
    };
}));

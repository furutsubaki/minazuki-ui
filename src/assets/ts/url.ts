const SAFE_URL_PATTERN = /^(https?:|\/|\.\/|\.\.\/|#|mailto:|tel:)/i;
const DANGEROUS_SCHEMAS = ['javascript:', 'data:', 'vbscript:'];

export const isSafeNavigationUrl = (url: string): boolean => {
    if (!url) return false;
    const lower = url.trim().toLowerCase();
    if (DANGEROUS_SCHEMAS.some((s) => lower.startsWith(s))) return false;
    return SAFE_URL_PATTERN.test(url.trim());
};

export const formatLocaleString = (v: string) => {
    const int = parseInt(v.replace(/[^0-9]/g, ''), 10);
    return isNaN(int) ? '' : int.toLocaleString();
};
export const parseLocaleString = (v: string) => {
    const int = parseInt(v.replace(/[^0-9]/g, ''), 10);
    return isNaN(int) ? '' : int.toString();
};
export const toKebabCase = (v: string) => {
    return v
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();
};
export const toSnakeCase = (v: string) => {
    return v
        .split(/(?=[A-Z])/)
        .join('_')
        .toLowerCase();
};

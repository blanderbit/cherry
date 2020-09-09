export function getEnumKeys(obj: any): string[] {
    if (!obj)
        return [];
    return Object.keys(obj).filter(val => Number.isNaN(+val));
}

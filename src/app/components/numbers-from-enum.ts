export function numbersFromEnum(obj: any): number[] {
  if (!obj)
    return [];
  return Object.keys(obj).map(it => +it).filter(val => !Number.isNaN(val));
}

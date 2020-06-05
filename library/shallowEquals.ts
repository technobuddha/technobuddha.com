// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sameValue(x: any, y: any) {
    if (x === y)
        return x !== 0 || 1 / x === 1 / y;
    else
        return x !== x && y !== y;
}

export function shallowEquals(
    objA: Record<string, unknown> | null | undefined,
    objB: Record<string, unknown> | null | undefined,
    exclude: string[] = []
): boolean {
    if (sameValue(objA, objB))
        return true;

    if(objA === null || objA == undefined || objB === null || objB === undefined)
        return false;

    const hash  = new Set(exclude);

    const keysA = Object.keys(objA).filter(key => !hash.has(key));
    const keysB = Object.keys(objB).filter(key => !hash.has(key));

    if (keysA.length !== keysB.length)
        return false;

    for (const key of keysA)
    {
        if (!Object.prototype.hasOwnProperty.call(objB, key) || !sameValue(objA[key], objB[key]))
            return false;
    }

    return true;
}

export default shallowEquals;

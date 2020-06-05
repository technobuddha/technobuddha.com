import isNil from 'lodash/isNil';

export function nullDate(s: null | undefined | string): null | Date
{
    return isNil(s) ? null : new Date(s);
}

export function nullNumber(n: null | undefined | number): null | number
{
    return isNil(n) ? null : n;
}

export function nullString(s: null | undefined | string): null | string
{
    return isNil(s) ? null : s;
}

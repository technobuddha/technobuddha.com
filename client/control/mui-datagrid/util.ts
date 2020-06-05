import isDate   from 'lodash/isDate';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import toString from 'lodash/toString';

export function toDateUTCString(entity: unknown): string | null {
    if(entity === null || entity === undefined)
        return null;
    else if(isDate(entity))
        return entity.toUTCString();
    else if(isString(entity) || isNumber(entity))
        return new Date(entity).toUTCString();
    else
        return new Date(toString(entity)).toUTCString();
}

export function toDate(entity: unknown): Date {
    return new Date(entity as (string | number | Date));
}

export function toTimestamp(entity: unknown): number {
    return new Date(entity as (string | number | Date)).getTime();
}

export function toInteger(entity: unknown): number {
    return isNumber(entity) ? Math.trunc(entity) : isString(entity) ? parseInt(entity as string, 10) : NaN;
}

export function toNumber(entity: unknown): number {
    return isNumber(entity) ? entity : isString(entity) ? parseFloat(entity as string) : NaN;
}

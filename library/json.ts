import toString from 'lodash/toString';

const specialBegin  = '﴾';
const specialFinish = '﴿';

export const escape     = false;
export const spaces     = null;
export const replacer   = function (this: Record<string, unknown>, key: string, value: unknown): unknown {
    if(this[key] instanceof Date) {
        return `${specialBegin}Date:${toString(value)}${specialFinish}`;
    }

    return value;
}

export const reviver    = function (this: unknown, _key: string, value: unknown) {
    if(typeof value === 'string' && value.slice(0, 1) === specialBegin && value.slice(-1) === specialFinish) {
        const [ type, jsonValue ] = value.split(/:(.+)/);
        switch(type) {
            case 'Date':
                return new Date(jsonValue);
        }
    }
    return value;
}

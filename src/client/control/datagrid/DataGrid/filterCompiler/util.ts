import isArray  from 'lodash/isArray';
import isNil    from 'lodash/isNil';

export function getUniqueValues<T = unknown>(data: T[], name: keyof T) {
    const set    = new Set<string>();
    data.forEach(
        datum => {
            const v = datum[name];

            if(!isNil(v)) {
                if(isArray(v))
                    v.forEach(vv => { if(!isNil(vv)) set.add(vv.toString()); });
                else if(!isNil(v))
                    set.add((v as any)?.toString?.());
            }
        }
    );
    return Array.from(set.values());
}

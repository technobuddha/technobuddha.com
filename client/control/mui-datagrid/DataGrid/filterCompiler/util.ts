import isNil    from 'lodash/isNil';
import isArray  from 'lodash/isArray';

export function getUniqueValues<T = unknown>(data: T[], name: string) {
    const set    = new Set<string>();
    data.forEach(
        datum => {
            const v = (datum as Record<string, unknown>)[name];

            if(!isNil(v)) {
                if(isArray(v)) {
                    v.forEach(vv => { if(!isNil(vv)) set.add(vv.toString()); });
                } else {
                    if(!isNil(v)) set.add((v as any)?.toString?.());
                }
            }
        }
    );
    return Array.from(set.values());
}


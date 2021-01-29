import mapValues   from 'lodash/mapValues';
import isArray     from 'lodash/isArray';
import queryString from 'query-string';

import type { ParsedQuery } from 'query-string';
import type { SortKey }     from './Sorter';

const KEY_SORT = 'sort';

export function getSortFromQueryString<T = unknown>(): SortKey<T> | undefined {
    const { [KEY_SORT]: sort } = queryString.parse(location.search);

    if(sort === null) {
        return undefined;
    } else if(isArray(sort)) {
        if(sort.length === 0)
            return undefined;
        return sort[0] as SortKey<T>;
    }

    return sort as SortKey<T>;
}

export function setSortInQueryString<T = unknown>(sort: SortKey<T> | null) {
    const search = queryString.parse(location.search);

    search[KEY_SORT] = sort as string;
    history.pushState(null, '', `${location.pathname}?${queryString.stringify(search)}${location.hash}`);
}

export function getFiltersFromQueryString() {
    const { [KEY_SORT]: _, ...filterValues } = mapValues(
        queryString.parse(location.search),
        q => q ?? null
    );

    return filterValues;
}

export function setFiltersInQueryString<T = unknown>(filterValues: ParsedQuery) {
    const sort      = getSortFromQueryString<T>();
    const search    = { ...filterValues, [KEY_SORT]: sort };

    history.pushState(null, '', `${location.pathname}?${queryString.stringify(search)}${location.hash}`);
}

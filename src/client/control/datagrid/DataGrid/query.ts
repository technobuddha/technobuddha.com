import mapValues   from 'lodash/mapValues';
import isArray     from 'lodash/isArray';
import queryString from 'query-string';

import type { ParsedQuery } from 'query-string';
import type { SortKey }     from './Sorter';

const KEY_SORT = 'sort';

export function getSortFromQueryString<T = unknown>() {
    let { [KEY_SORT]: sort } = queryString.parse(location.search);

    if(sort === null || sort == undefined)
        return undefined;
    else if(isArray(sort)) {
        if(sort.length === 0)
            return undefined;
        else
            sort = sort[0];
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

export function setFiltersInQueryString(filterValues: ParsedQuery) {
    const sort      = getSortFromQueryString();
    const search    = { ...filterValues, [KEY_SORT]: sort };

    history.pushState(null, '', `${location.pathname}?${queryString.stringify(search)}${location.hash}`);
}

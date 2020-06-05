import mapValues                    from 'lodash/mapValues';
import isArray                      from 'lodash/isArray';
import queryString, { ParsedQuery } from 'query-string';

const KEY_SORT = 'sort';

export function getSortFromQueryString() {
    let { [KEY_SORT]: sort } = queryString.parse(location.search);

    if(sort === null || sort == undefined)
        return undefined;
    else if(isArray(sort)) {
        if(sort.length === 0)
            return undefined;
        else
            sort = sort[0];
    }

    return sort;
}

export function setSortInQueryString(sort: string | undefined) {
    const search = queryString.parse(location.search);

    search[KEY_SORT] = sort;
    history.pushState(null, '', `${location.pathname}?${queryString.stringify(search)}${location.hash}`);
}

export function getFiltersFromQueryString() {
    const { [KEY_SORT]: _, ...filterValues } = mapValues(
        queryString.parse(location.search),
        q => q ?? undefined
    );

    return filterValues;
}

export function setFiltersInQueryString(filterValues: ParsedQuery) {
    const sort      = getSortFromQueryString();
    const search    = {...filterValues, [KEY_SORT]: sort}

    history.pushState(null, '', `${location.pathname}?${queryString.stringify(search)}${location.hash}`);
}
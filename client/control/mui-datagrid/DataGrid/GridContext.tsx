import React            from 'react';
import isUndefined      from 'lodash/isUndefined';
import { FilterValue, FilterValues } from './filter';
import { getSortFromQueryString, setSortInQueryString, getFiltersFromQueryString, setFiltersInQueryString } from './query';

type GridState<T = unknown> = {
    data:               T[];
    sort?:              ReturnType<typeof parseSort>;
    changeSort:         (sort: string) => void;
    filterValues:       FilterValues;
    changeFilter:       (name: string, value: FilterValue) => void;
}

const GridContext = React.createContext<GridState>(null!);
export function useGrid<T = unknown>() {
   return React.useContext(GridContext) as GridState<T>;
}

type GridProviderProps<T = unknown> = {
    data:               T[];
    defaultSort?:       string;
    useLocation?:       boolean;
    children:           React.ReactNode;
};

function parseSort(sort: string) {
    const sortAscending     = !sort.startsWith('-');
    const sortBy            = sortAscending ? sort : sort.slice(1);

    return { sortBy, sortAscending };
}

function buildSort(column: string, ascending: boolean) {
    if(ascending)
        return column;
    else
        return `-${column}`;
}

export function GridProvider<T = unknown>({data, defaultSort, useLocation, children}: GridProviderProps<T>) {
    const baseSort                  = React.useCallback(() => (useLocation ? (getSortFromQueryString() ?? defaultSort) : defaultSort), []);
    const [ sortCode, setSortCode ] = React.useState<string | undefined>(baseSort)
    const changeSort                = React.useCallback(
        (columnName: string) => {
            let newSort: string;

            if(isUndefined(sortCode))
                newSort = columnName;
            else {
                const { sortBy, sortAscending } = parseSort(sortCode);
                newSort = buildSort(columnName, (columnName === sortBy ? !sortAscending : true));
            }

            setSortCode(newSort);
            if(useLocation)
                setSortInQueryString(newSort);
        },
        [sortCode]
    );

    const baseFilterValues                  = React.useCallback(() => (useLocation ? getFiltersFromQueryString() : {}), []);
    const [ filterValues, setFilterValues ] = React.useState<FilterValues>(baseFilterValues);
    const changeFilter                      = React.useCallback(
        (name: string, value: FilterValue) => {
            const newFilterValues = {...filterValues, [name]: value};
            setFilterValues(newFilterValues);
            if(useLocation)
                setFiltersInQueryString(newFilterValues);
        },
        [filterValues]
    );

    const handlePopState                    = React.useCallback(
        () => {
            setSortCode(baseSort());
            setFilterValues(baseFilterValues());
        },
        []
    );
    
    React.useEffect(
        () => {
            if(useLocation)
                window.addEventListener('popstate', handlePopState);
            return () => {
                if(useLocation)
                    window.removeEventListener('popstate', handlePopState)
            };
        },
        [useLocation]
    );

    const sort = sortCode === undefined ? undefined : parseSort(sortCode);
    return (
        <GridContext.Provider value={{data, sort, changeSort, filterValues, changeFilter}}>
            {children}
        </GridContext.Provider>
    )
}

export default useGrid;

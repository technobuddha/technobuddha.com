import React                    from 'react';
import { useGrid }              from './GridContext';
import { serializeFilterValue } from './filter';

import type { Filter } from './filter';

type FiltererProps<T = unknown> = {
    filters:    Filter<T>[];
    children:   (renderProps: FiltererRenderProps<T>) => React.ReactElement;
};

export type FiltererRenderProps<T = unknown> = {
    data:       T[];
};

export function Filterer<T = unknown>({ filters, children }: FiltererProps<T>) {
    const { data, filterValues } = useGrid<T>();
    const filteredData           = React.useMemo(
        () => {
            console.log('Filtering...');

            let fData = [...data];
            filters.forEach(filter => { fData = filter.execute(fData, filterValues[filter.name]); });
            return fData;
        },
        [data, filters, serializeFilterValue(filterValues)]
    );

    return children({ data: filteredData });
}

export default Filterer;

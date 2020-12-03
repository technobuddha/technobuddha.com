import React                            from 'react';
import { useDerivedValue }              from '@technobuddha/react-hooks';
import { useGrid }                      from './GridContext';
import { Filter, serializeFilterValue } from './filter';

type FiltererProps<T = unknown> = {
    filters:    Filter<T>[];
    children:   (renderProps: FiltererRenderProps<T>) => React.ReactElement;
};

export type FiltererRenderProps<T = unknown> = {
    data:       T[];
}

export function Filterer<T = unknown>({filters, children}: FiltererProps<T>) {
    const { data, filterValues } = useGrid<T>();
    const filteredData           = useDerivedValue(
        () => {
            console.log('Filtering...');

            let filteredData = [...data];
            filters.forEach(filter => { filteredData = filter.execute(filteredData, filterValues[filter.name]); });
            return filteredData;
        },
        [data, filters, serializeFilterValue(filterValues)]
    );

    return children({data: filteredData});
}

export default Filterer;

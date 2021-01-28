import React       from 'react';
import isArray     from 'lodash/isArray';
import mapValues   from 'lodash/mapValues';
import { useGrid } from '../GridContext';

export type Filter<T = unknown> = {
    name:       keyof T;
    Actuator:   React.ComponentType<FilterActuatorProps>;
    Indicator?: React.ComponentType<FilterIndicatorProps>;
    execute:    (data: T[], value: FilterValue) => T[];
};

export type FilterValue               = string | string[] | null;
export type FilterValues<T = unknown> = Record<keyof T, FilterValue>;

export type FilterActuatorProps = {
    classes?:   FilterActuatorClasses;
    styles?:    FilterActuatorStyles;
};

export type FilterIndicatorProps = {
    classes?:   FilterIndicatorClasses;
    styles?:    FilterIndicatorStyles;
};

export type FilterActuatorClasses = {
    root:       string;
    button:     string;
    icon:       string;
    title:      string;
};
export type FilterActuatorStyles = {[key in keyof FilterActuatorClasses]: React.CSSProperties};

export type FilterIndicatorClasses = {
    root:       string;
};
export type FilterIndicatorStyles = {[key in keyof FilterIndicatorClasses]: React.CSSProperties};

function queryStringizeFilterValue<T = unknown>(filterValues: FilterValues<T>) {
    return JSON.stringify(mapValues(filterValues, filterValue => {
        if(filterValue === null)
            return null;
        else if(isArray(filterValue))
            return filterValue.join('&');
        else
            return filterValue;
    }));
}

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
        [data, filters, queryStringizeFilterValue(filterValues)]
    );

    return children({ data: filteredData });
}

export default Filterer;

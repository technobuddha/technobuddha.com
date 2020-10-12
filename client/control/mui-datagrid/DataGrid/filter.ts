import React        from 'react';
import isArray      from 'lodash/isArray';
import mapValues    from 'lodash/mapValues';

export type Filter<T = unknown> = {
    name:       string;
    Actuator:   React.ComponentType<FilterActuatorProps>;
    Indicator?: React.ComponentType<FilterIndicatorProps>;
    execute:    (data: T[], value: FilterValue) => T[];
}

export type FilterValue  = string | string[] | null;
export type FilterValues = Record<string, FilterValue>;

export type FilterActuatorProps = {
    classes?:   FilterActuatorClasses;
    styles?:    FilterActuatorStyles;
}

export type FilterIndicatorProps = {
    classes?:   FilterIndicatorClasses;
    styles?:    FilterIndicatorStyles;
}

export type FilterActuatorClasses = {
    root:       string;
    button:     string;
    icon:       string;
    title:      string;
}
export type FilterActuatorStyles = {[key in keyof FilterActuatorClasses]: React.CSSProperties};

export type FilterIndicatorClasses = {
    root:       string;
}
export type FilterIndicatorStyles = {[key in keyof FilterIndicatorClasses]: React.CSSProperties};

export function serializeFilterValue(filterValues: FilterValues) {
    return JSON.stringify(mapValues(filterValues, filterValue => {
        if(filterValue === undefined)
            return undefined;
        else if(isArray(filterValue))
            return filterValue.join('&');
        else
            return filterValue;
    }));
}

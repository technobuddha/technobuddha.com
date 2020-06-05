import isArray          from 'lodash/isArray';
import isString         from 'lodash/isString';
import { FilterValue }  from '../filter';

export const normalizeFilterValue   = (filterValue: FilterValue) => 
    (isArray(filterValue) ? (filterValue.length > 0 ? filterValue[0] : undefined) : filterValue);


export const normalizeFilterArray   = (filterValue: FilterValue) => 
    (isArray(filterValue) ? (filterValue.length > 0 ? filterValue : undefined) : (isString(filterValue) ? [filterValue] : undefined));

    /*
        const normalizeFilterValue = (filterValue: FilterValue) => {
        return (isArray(filterValue) ? (filterValue.length > 0 ? filterValue : undefined) : (isString(filterValue) ? [filterValue] : undefined));
    }
    */
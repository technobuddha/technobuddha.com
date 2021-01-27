import isArray  from 'lodash/isArray';
import isString from 'lodash/isString';

import type { FilterValue } from '../filter';

export const normalizeFilterValue   = (filterValue: FilterValue) =>
    (isArray(filterValue) ? (filterValue.length > 0 ? filterValue[0] : null) : filterValue);

export const normalizeFilterArray   = (filterValue: FilterValue) =>
    (isArray(filterValue) ? (filterValue.length > 0 ? filterValue : null) : (isString(filterValue) ? [filterValue] : null));

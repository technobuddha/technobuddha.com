import isArray                                        from 'lodash/isArray';
import some                                           from 'lodash/some';
import toString                                       from 'lodash/toString';
import { normalizeFilterValue, normalizeFilterArray } from './normalization';

import type { FilterValue } from '../../filter';
import type { Shape }       from '../../analyzer';

export function searchExecute<T = unknown>(name: keyof T, shape: Shape) {
    switch(shape) {
        case 'key-value': {
            return (data: T[], value: FilterValue) => {
                const filterValue = normalizeFilterValue(value);

                if(filterValue) {
                    const search = filterValue.toLocaleLowerCase();

                    return data.filter(
                        datum => {
                            const field = datum[name];

                            return (
                                isArray(field)
                                    ?   some(field, f => toString(f).toLocaleLowerCase().includes(search))
                                    :   toString(field).toLocaleLowerCase().includes(search)
                            );
                        }
                    );
                }

                return data;
            };
        }

        case 'array': {
            const key = parseInt(name as string, 10);

            return (data: T[], value: FilterValue) => {
                const filterValue = normalizeFilterValue(value);

                if(filterValue) {
                    const search = filterValue.toLocaleLowerCase();

                    return data.filter(
                        datum => {
                            const field = (datum as unknown as unknown[])[key];

                            return (
                                isArray(field)
                                    ?   some(field, f => toString(f).toLocaleLowerCase().includes(search))
                                    :   toString(field).toLocaleLowerCase().includes(search)
                            );
                        }
                    );
                }

                return data;
            };
        }

        case 'primitive':
        case 'polymorphic':
        default: {
            return (data: T[], value: FilterValue) => {
                const filterValue = normalizeFilterValue(value);

                if(filterValue) {
                    const search = filterValue.toLocaleLowerCase();
                    return data.filter(datum => toString(datum).toLocaleLowerCase().includes(search));
                }

                return data;
            };
        }
    }
}

export function equalityExecute<T = unknown>(name: keyof T, shape: Shape) {
    switch(shape) {
        case 'key-value': {
            return (data: T[], value: FilterValue) => {
                const filterValue   = normalizeFilterArray(value);

                if(filterValue) {
                    return data.filter(
                        datum => {
                            const field = datum[name];

                            return (
                                isArray(field)
                                    ?   some(field, f => filterValue.includes(toString(f)))
                                    :   filterValue.includes(toString(field))
                            );
                        }
                    );
                }

                return data;
            };
        }

        case 'array': {
            const key = parseInt(name as string, 10);

            return (data: T[], value: FilterValue) => {
                const filterValue   = normalizeFilterArray(value);

                if(filterValue) {
                    return data.filter(
                        datum => {
                            const field = (datum as unknown as unknown[])[key];

                            return (
                                isArray(field)
                                    ?   some(field, f => filterValue.includes(toString(f)))
                                    :   filterValue.includes(toString(field))
                            );
                        }
                    );
                }

                return data;
            };
        }

        case 'primitive':
        case 'polymorphic':
        default: {
            return (data: T[], value: FilterValue) => {
                const filterValue   = normalizeFilterArray(value);

                if(filterValue)
                    return data.filter(datum => filterValue.includes(toString(datum)));

                return data;
            };
        }
    }
}

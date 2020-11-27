import isArray                  from 'lodash/isArray';
import some                     from 'lodash/some';
import toString                 from 'lodash/toString';
import { FilterValue }          from '../filter';
import { Shape }                from '../analyzer';
import { normalizeFilterValue, normalizeFilterArray } from './normalization';

export function searchExecute<T = unknown>(name: string, shape: Shape) {
    switch(shape) {
        case 'key-value':{
            return (data: T[], value: FilterValue) => {
                const filterValue = normalizeFilterValue(value);

                if(filterValue) {
                    const search = filterValue.toLocaleLowerCase();

                    return data.filter(
                        datum => {
                            const field = (datum as Record<string, unknown>)[name];

                            return (
                                isArray(field)
                                ?   some(field, f => toString(f).toLocaleLowerCase().includes(search))
                                :   toString(field).toLocaleLowerCase().includes(search)
                            );
                        }
                    )
                } else
                    return data;
            }
        }

        case 'array': {
            const key = parseInt(name);

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
                    )
                } else
                    return data;
            }
        }

        case 'primitive':
        case 'polymorphic': {
            return (data: T[], value: FilterValue) => {
                const filterValue = normalizeFilterValue(value);

                if(filterValue) {
                    const search = filterValue.toLocaleLowerCase();
                    return data.filter(datum => toString(datum).toLocaleLowerCase().includes(search));
                } else
                    return data;
            }
        }
    }
}

export function equalityExecute<T = unknown>(name: string, shape: Shape) {
    switch(shape) {
        case 'key-value':{
            return (data: T[], value: FilterValue) => {
                const filterValue   = normalizeFilterArray(value);
            
                if(filterValue)
                    return data.filter(
                        datum => {
                            const field = (datum as Record<string, any>)[name];
            
                            return (
                                isArray(field)
                                ?   some(field, f => filterValue.includes(toString(f)))
                                :   filterValue.includes(toString(field))
                            );
                        }
                    )
                else
                    return data;
            }
        }

        case 'array': {
            const key = parseInt(name);

            return (data: T[], value: FilterValue) => {
                const filterValue   = normalizeFilterArray(value);
            
                if(filterValue)
                    return data.filter(
                        datum => {
                            const field = (datum as unknown as unknown[])[key];
            
                            return (
                                isArray(field)
                                ?   some(field, f => filterValue.includes(toString(f)))
                                :   filterValue.includes(toString(field))
                            );
                        }
                    )
                else
                    return data;
            }
        }

        case 'primitive':
        case 'polymorphic': {
            return (data: T[], value: FilterValue) => {
                const filterValue   = normalizeFilterArray(value);

                if(filterValue)
                    return data.filter(datum => filterValue.includes(toString(datum)));
                else
                    return data;
            }
        }
    }
}

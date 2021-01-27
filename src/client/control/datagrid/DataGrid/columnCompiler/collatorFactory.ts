import toNumber     from '@technobuddha/library/toNumber';
import toTimestamp  from '@technobuddha/library/toTimestamp';
import isNil        from 'lodash/isNil';
import isNumber     from 'lodash/isNumber';
import toString     from 'lodash/toString';

import type { Shape }                           from '../analyzer';
import type { ColumnSpecification, ColumnType } from '../column';

export const nullCollator = () => () => 0;
const intlCollator = new Intl.Collator(undefined, { sensitivity: 'base' });

export function collatorFactory<T = unknown>(column: ColumnSpecification<T>, type: ColumnType, shape: Shape) {
    if(column.collate)
        return column.collate;

    switch(shape) {
        case 'key-value': {
            const key = column.name.toString();

            switch(type.dataType) {
                case 'array':
                case 'string': {
                    return (ascending: boolean) => {

                        return ascending
                            ?   (x: T, y: T) => {
                                    const xx = (x as Record<string, unknown>)[key];
                                    const yy = (y as Record<string, unknown>)[key];
                                    return isNil(xx) ? (isNil(yy) ? 0 : +1) : (isNil(yy) ? -1 : intlCollator.compare(toString(xx), toString(yy)));
                                }
                            :   (x: T, y: T) => {
                                    const xx = (x as Record<string, unknown>)[key];
                                    const yy = (y as Record<string, unknown>)[key];
                                    return isNil(yy) ? (isNil(xx) ? 0 : -1) : (isNil(xx) ? +1 : intlCollator.compare(toString(yy), toString(xx)));
                                };
                    };
                }

                case 'number': {
                    return (ascending: boolean) => {
                        return ascending
                            ?   (x: T, y: T) => {
                                    const xx = (x as Record<string, unknown>)[key];
                                    const yy = (y as Record<string, unknown>)[key];
                                    return isNil(xx) ? (isNil(yy) ? 0 : +1) : (isNil(yy) ? -1 : toNumber(xx) - toNumber(yy));
                                }
                            :   (x: T, y: T) => {
                                    const xx = (x as Record<string, unknown>)[key];
                                    const yy = (y as Record<string, unknown>)[key];
                                    return isNil(yy) ? (isNil(xx) ? 0 : -1) : (isNil(xx) ? +1 : toNumber(yy) - toNumber(xx));
                                };
                    };
                }

                case 'date': {
                    return (ascending: boolean) => {
                        return ascending
                            ?   (x: T, y: T) => {
                                    const xx = (x as Record<string, unknown>)[key];
                                    const yy = (y as Record<string, unknown>)[key];
                                    return isNil(xx) ? (isNil(yy) ? 0 : +1) : (isNil(yy) ? -1 : toTimestamp(xx) - toTimestamp(yy));
                                }
                            :   (x: T, y: T) => {
                                    const xx = (x as Record<string, unknown>)[key];
                                    const yy = (y as Record<string, unknown>)[key];
                                    return isNil(yy) ? (isNil(xx) ? 0 : -1) : (isNil(xx) ? +1 : toTimestamp(yy) - toTimestamp(xx));
                                };
                    };
                }

                default:
                    return nullCollator;
            }
        }

        case 'array': {
            const key = isNumber(column.name) ? column.name : parseInt(column.name);

            switch(type.dataType) {
                case 'string':
                    return (ascending: boolean) => {
                        return ascending
                            ?   (x: T, y: T) => {
                                    const xx = (x as unknown as unknown[])[key];
                                    const yy = (y as unknown as unknown[])[key];
                                    return isNil(xx) ? (isNil(yy) ? 0 : +1) : (isNil(yy) ? -1 : intlCollator.compare(toString(xx), toString(yy)));
                                }
                            :   (x: T, y: T) => {
                                    const xx = (x as unknown as unknown[])[key];
                                    const yy = (y as unknown as unknown[])[key];
                                    return isNil(yy) ? (isNil(xx) ? 0 : -1) : (isNil(xx) ? +1 : intlCollator.compare(toString(yy), toString(xx)));
                                };
                    };

                case 'number': {
                    return (ascending: boolean) => {
                        return ascending
                            ?   (x: T, y: T) => {
                                    const xx = (x as unknown as unknown[])[key];
                                    const yy = (y as unknown as unknown[])[key];
                                    return isNil(xx) ? (isNil(yy) ? 0 : +1) : (isNil(yy) ? -1 : toNumber(x) - toNumber(y));
                                }
                            :   (x: T, y: T) => {
                                    const xx = (x as unknown as unknown[])[key];
                                    const yy = (y as unknown as unknown[])[key];
                                    return isNil(yy) ? (isNil(xx) ? 0 : -1) : (isNil(xx) ? +1 : toNumber(y) - toNumber(y));
                                };
                    };
                }

                case 'date': {
                    return (ascending: boolean) => {
                        return ascending
                            ?   (x: T, y: T) => {
                                    const xx = (x as unknown as unknown[])[key];
                                    const yy = (y as unknown as unknown[])[key];
                                    return isNil(xx) ? (isNil(yy) ? 0 : +1) : (isNil(yy) ? -1 : toTimestamp(xx) - toTimestamp(yy));
                                }
                            :   (x: T, y: T) => {
                                    const xx = (x as unknown as unknown[])[key];
                                    const yy = (y as unknown as unknown[])[key];
                                    return isNil(yy) ? (isNil(xx) ? 0 : -1) : (isNil(xx) ? +1 : toTimestamp(yy) - toTimestamp(xx));
                                };
                    };
                }

                default:
                    return nullCollator;
            }
        }

        case 'primitive':
        case 'polymorphic': {
            switch(type.dataType) {
                case 'string': {
                    return (ascending: boolean) => ascending
                        ?   (x: T, y: T) => isNil(x) ? (isNil(y) ? 0 : +1) : (isNil(y) ? -1 : intlCollator.compare(toString(x), toString(y)))
                        :   (x: T, y: T) => isNil(y) ? (isNil(x) ? 0 : -1) : (isNil(x) ? +1 : intlCollator.compare(toString(y), toString(x)));
                }

                case 'number': {
                    return (ascending: boolean) => ascending
                        ?   (x: T, y: T) => isNil(x) ? (isNil(y) ? 0 : +1) : (isNil(y) ? -1 : toNumber(x) - toNumber(y))
                        :   (x: T, y: T) => isNil(y) ? (isNil(x) ? 0 : -1) : (isNil(x) ? +1 : toNumber(y) - toNumber(x));
                }

                case 'date': {
                    return (ascending: boolean) => {
                        return ascending
                            ?   (x: T, y: T) => isNil(x) ? (isNil(y) ? 0 : +1) : (isNil(y) ? -1 : toTimestamp(x) - toTimestamp(y))
                            :   (x: T, y: T) => isNil(y) ? (isNil(x) ? 0 : -1) : (isNil(x) ? +1 : toTimestamp(y) - toTimestamp(x));
                    };
                }

                default:
                    return nullCollator;
            }
        }
    }
}

export default collatorFactory;

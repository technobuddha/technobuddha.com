import isDate                   from 'lodash/isDate';
import isArray                  from 'lodash/isArray';
import isString                 from 'lodash/isString';
import isObject                 from 'lodash/isObject';
import isNumber                 from 'lodash/isNumber';
import rendererFactory          from './columnCompiler/rendererFactory';
import headerFactory            from './columnCompiler/headerFactory';
import collatorFactory          from './columnCompiler/collatorFactory';
import { Column, ColumnType, ColumnSpecifications } from './column';

export type IdentifiedType = 'string' | 'number' | 'boolean' | 'symbol' | 'object' | 'function' | 'undefined' | 'iso-date' | 'null' | 'date' | 'array';
export type Shape          = 'key-value' | 'array' | 'primitive' | 'polymorphic';

const isoDate       = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/
const numberString  = /^((?:NaN|[+-]?(?:(?:\d+|\d*\.\d+)(?:[Ee][+-]?\d+)?|[+-]?Infinity)))$/

export type AnalyzerResults<T = unknown> = {
    getColumnType: (key: string) => ColumnType;
    getShape: () => Shape;
    createDefaultColumn: (name: string) => Column<T>;
    getKeys: () => string[];
}

export function analyzer<T = unknown>({data, columns}: {data: T[], columns?: ColumnSpecifications<T>}): AnalyzerResults<T> {
    let information: {types: Record<string, ColumnType>, shape: Shape};

    function getShape(): Shape {
        if(!information) information = analyze({data, columns});
        return information.shape;
    }

    function getColumnType(key: string): ColumnType {
        if(!information) information = analyze({data, columns});
        return information.types[key] ?? 'unknown';
    }

    function createDefaultColumn(name: string): Column<T> {
        const shape = getShape();
        const type  = getColumnType(name);

        return {
            name:       name.toString(),
            width:      '*',
            header:     headerFactory({name}, type, shape),
            render:     rendererFactory({name}, type, shape),
            sortBy:     [name],
            collate:    collatorFactory({name}, type, shape),
        }
    }

    function getKeys(): string[] {
        if(!information) information = analyze({data, columns});
        return Object.keys(information.types);
    }

    return {getColumnType, getShape, createDefaultColumn, getKeys};
}

function analyze<T = unknown>({data, columns}: {data: T[], columns?: ColumnSpecifications<T>}): {types: Record<string, ColumnType>, shape: Shape} {
    const types         = {} as Record<string, ColumnType> ;
    const used          = new Set<string>();
    const columnData    = {} as Record<string, Set<IdentifiedType>>;
    const shapes        = new Set<Shape>(); 
    
    if(columns) {
        columns.forEach(
            column => {
                if(isString(column) || isNumber(column))
                    used.add(column.toString());
                else {
                    used.add(column.name.toString());

                    if(isArray(column.sortBy))
                        column.sortBy.forEach(sort => used.add(sort.toString()));

                    if(column.type) {
                        if(isString(column.type))
                            types[column.name] = { dataType: column.type, nullable: false };
                        else
                            types[column.name] = column.type;
                    }
                }
            }
        );
    }

    data.slice(0, 1000).forEach(datum => {
        if(isObject(datum) && !isDate(datum)) {
            Object.keys(datum).forEach(key => {
                if(!(key in columnData))
                    columnData[key] = new Set<IdentifiedType>();
        
                columnData[key]!.add(identify((datum as Record<string, unknown>)[key]));
            });

            shapes.add('key-value');
        } else if(isArray(datum)) {
            for(let i = 0; i < datum.length; ++i) {
                const key = i.toString();

                if(!(key in columnData))
                    columnData[key] = new Set<IdentifiedType>();
        
                columnData[key]!.add(identify(datum[i]));
            }

            shapes.add('array');
        } else {
            const type = identify(datum);

            if(used.size > 0) {
                for(const key of used.keys()) {
                    if(!(key in columnData))
                        columnData[key] = new Set<IdentifiedType>();

                    columnData[key]!.add(type);
                }
            } else {
                if(!('*' in columnData))
                    columnData['*'] = new Set<IdentifiedType>();

                columnData['*']!.add(type);
            }

            shapes.add('primitive');
        }
    });
                
    for(const [key, identified] of Object.entries(columnData)) {
        if(!(key in types)) {
            let nullable = false;

            if(identified.has('null') || identified.has('undefined')) {
                identified.delete('null');
                identified.delete('undefined');
                nullable = true;
            }
        
            if(identified.has('string') && identified.has('iso-date')) {
                identified.delete('iso-date');
            }

            if(identified.has('string') && identified.has('number')) {
                identified.delete('number');
            }
            
            if(identified.size === 1 && identified.has('number')) {
                types[key] = { dataType: 'number',  nullable }
            } else if(identified.size === 1 && (identified.has('date') || identified.has('iso-date'))) {
                types[key] = { dataType: 'date',    nullable };
            } else if(identified.size === 1 && identified.has('string')) {
                types[key] = { dataType: 'string',  nullable };
            } else if(identified.size === 1 && identified.has('object')) {
                types[key] = { dataType: 'object',  nullable };
            } else if(identified.size === 1 && identified.has('array')) {
                types[key] = { dataType: 'array',   nullable };
            } else
                types[key] = { dataType: 'unknown', nullable };
        }
    }

    const shape = (shapes.size === 1) ? shapes.values().next().value : 'polymorphic';

    console.log(types, shape);
    return {types, shape};
}

function identify(value: unknown, identifyArrays = true): IdentifiedType {
    const type  = typeof(value);
    switch(type) {
        case 'string':
            if(isoDate.test(value as string))
                return 'iso-date';
            else if(numberString.test(value as string))
                return 'number';
            else
                return 'string';

        case 'number':
        case 'bigint':
            return 'number';

        case 'object':
            if(value === null)
                return 'null';
            else if(isDate(value))
                return 'date';
            else if(identifyArrays && isArray(value)) {
                const arrayTypes = new Set<IdentifiedType>();
                value.forEach(val => { arrayTypes.add(identify(val, false)); });

                if((arrayTypes.size === 1 && arrayTypes.has('string')) ||
                   (arrayTypes.size === 2 && arrayTypes.has('string') && arrayTypes.has('iso-date')) ||
                   (arrayTypes.size === 1 && arrayTypes.has('number')) ||
                   (arrayTypes.size === 1 && (arrayTypes.has('date') || arrayTypes.has('iso-date'))) ||
                   (arrayTypes.size === 2 && (arrayTypes.has('date') && arrayTypes.has('iso-date')))
                )
                    return 'array';

                return 'object';    
            }
            else
                return 'object';

        case 'boolean':
        case 'symbol':
        case 'undefined':
        case 'function':
            return type;
    }
}

export default analyzer;
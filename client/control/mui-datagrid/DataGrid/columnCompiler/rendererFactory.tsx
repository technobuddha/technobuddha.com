import React        from 'react';
import toString     from 'lodash/toString';
import isNumber     from 'lodash/isNumber';
import { toDateUTCString }   from '../../util';
import Box          from '@material-ui/core/Box';
import { Shape }    from '../analyzer';
import { ColumnSpecification, ColumnType, ColumnRenderProps }   from '../column';

export function rendererFactory<T = unknown>(column: ColumnSpecification<T>, type: ColumnType, shape: Shape) {
    if(column.render)
        return column.render;
    else {
        switch(shape) {
            case 'key-value': {
                const key = column.name.toString();

                switch (type) {
                    case 'number':
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="right">{toString((datum as Record<string, unknown>)[key])}</Box>
                        );
            
                    case 'date':
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="right">{toDateUTCString((datum as Record<string, unknown>)[key])}</Box>
                        );
            
                    case 'unknown':
                    case 'string':
                    default:
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="left">{toString((datum as Record<string, unknown>)[key])}</Box>
                        );
                }
            }

            case 'array': {
                const key = isNumber(column.name) ? column.name : parseFloat(column.name);

                switch (type) {
                    case 'number':
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="right">{toString((datum as unknown as unknown[])[key])}</Box>
                        );
            
                    case 'date':
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="right">{toDateUTCString((datum as unknown as unknown[])[key])}</Box>
                        );
            
                    case 'unknown':
                    case 'string':
                    default:
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="left">{toString((datum as unknown as unknown[])[key])}</Box>
                        );
                }
            }

            case 'primitive':
            case 'polymorphic': {
                switch (type) {
                    case 'number':
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="right">{toString(datum)}</Box>
                        );
            
                    case 'date':
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="right">{toDateUTCString(datum)}</Box>
                        );
            
                    case 'unknown':
                    case 'string':
                    default:
                        return ({datum}: ColumnRenderProps<T>) => (
                            <Box flexGrow={1} margin={0.5} textAlign="left">{toString(datum)}</Box>
                        );
                }
            }
        }       
    }
}

export default rendererFactory;

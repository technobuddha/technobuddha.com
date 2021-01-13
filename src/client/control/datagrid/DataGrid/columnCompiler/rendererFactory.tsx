import React                from 'react';
import toDateUTCString      from '@technobuddha/library/toDateUTCString';
import Box                  from '@material-ui/core/Box';
import { makeStyles }       from '@material-ui/core/styles';
import clsx                 from 'clsx';
import isNumber             from 'lodash/isNumber';
import toString             from 'lodash/toString';
import { Anything }         from '../Anything';

import type { Shape }                                              from '../analyzer';
import type { ColumnSpecification, ColumnType, ColumnRenderProps } from '../column';

const useCellStyles = makeStyles(_theme => ({
    cell: {
        flexGrow: 1,
        //margin: theme.spacing(0.5),
    },
    left: {
        textAlign: 'left',
    },
    right: {
        textAlign: 'right',
    },
}));

export function rendererFactory<T = unknown>(column: ColumnSpecification<T>, type: ColumnType, shape: Shape) {
    if(column.render)
        return column.render;
    else {
        switch(shape) {
            case 'key-value': {
                const key = column.name.toString();

                return ({datum}: ColumnRenderProps<T>) => {
                    const css = useCellStyles();
                    const field = (datum as Record<string, unknown>)[key];
                    return <Anything className={css.cell} type={type.dataType}>{field}</Anything>;
                };
            }
            break;

            case 'array': {
                const key = isNumber(column.name) ? column.name : parseFloat(column.name);

                switch (type.dataType) {
                    case 'number':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            const field = (datum as unknown as unknown[])[key];
                            return <Box className={clsx(css.cell, css.right)}>{toString(field)}</Box>;
                        };
            
                    case 'date':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            const field = (datum as unknown as unknown[])[key];
                            return <Box className={clsx(css.cell, css.left)}>{toDateUTCString(field)}</Box>;
                        };
            
                    case 'unknown':
                    case 'string':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            const field = (datum as unknown as unknown[])[key];
                            return <Box className={clsx(css.cell, css.left)}>{toString(field)}</Box>;
                        };

                    case 'object':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            const field = (datum as unknown as unknown[])[key];
                            return <Box className={clsx(css.cell, css.left)}><Anything>{field}</Anything></Box>;
                        };

                    case 'array':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            const field = (datum as unknown as unknown[])[key] as unknown[];
                            return <Box className={clsx(css.cell, css.left)}><Anything>{field}</Anything></Box>;
                        };
                }
            }
            break;

            case 'primitive':
            case 'polymorphic': {
                switch (type.dataType) {
                    case 'number':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            return <Box className={clsx(css.cell, css.right)}>{toString(datum)}</Box>;
                        };
            
                    case 'date':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            return <Box className={clsx(css.cell, css.left)}>{toDateUTCString(datum)}</Box>
                        };
            
                    case 'unknown':
                    case 'string':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            return <Box className={clsx(css.cell, css.left)}>{toString(datum)}</Box>
                        };

                    case 'object':
                        return ({datum}: ColumnRenderProps<T>) => {
                            const css = useCellStyles();
                            return <Box className={clsx(css.cell, css.left)}><Anything>{datum}</Anything></Box>;
                        };

                    case 'array':
                        return () => <></>;
                }
            }
        }       
    }
}

export default rendererFactory;

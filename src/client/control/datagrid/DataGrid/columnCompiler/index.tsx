import React                                               from 'react';
import { makeStyles }                                      from '@material-ui/core/styles';
import isString                                            from 'lodash/isString';
import { RowSelectionIndicator, MasterSelectionIndicator } from '../selectionIndictors';
import { collatorFactory, nullCollator }                   from './collatorFactory';
import { headerFactory }                                   from './headerFactory';
import { rendererFactory }                                 from './rendererFactory';

import type { AnalyzerResults }                                                    from '../analyzer';
import type { Column, ColumnSpecifications, ColumnHeaderProps, ColumnRenderProps } from '../column';

const useStyles = makeStyles(theme => ({
    checkbox: {
        color: theme.palette.primary.contrastText,
    },
}));

function Header<T = unknown>({ data }: ColumnHeaderProps<T>) {
    const css = useStyles();

    return (
        <MasterSelectionIndicator
            data={data}
            className={css.checkbox}
        />
    );
}

function Render<T = unknown>({ datum }: ColumnRenderProps<T>) {
    return (
        <RowSelectionIndicator
            datum={datum}
        />
    );
}

export function columnCompiler<T = unknown>(
    { getKeys, getColumnType, getShape, createDefaultColumn }: AnalyzerResults<T>,
    selection: boolean, controlWidth: number, columns?: ColumnSpecifications<T>
): Column<T>[] {
    const cols = columns
        ?   columns.map(column => {
                if(isString(column))
                    return createDefaultColumn(column);

                const columnName    = column.name.toString();
                const shape         = getShape();
                const type          = getColumnType(columnName);

                return {
                    name:    columnName,
                    width:   column.width ?? '*',
                    header:  headerFactory(column, type, shape),
                    render:  rendererFactory(column, type, shape),
                    sortBy:  column.sortBy === null ? null : (column.sortBy ?? [ column.name ]),
                    collate: collatorFactory(column, type, shape),
                } as Column<T>;
            })
        :   getKeys().map(key => createDefaultColumn(key));

    if(selection) {
        cols.unshift({
            name: '[selection]',
            width: controlWidth,
            header: Header,
            render: Render,
            sortBy: null,
            collate: nullCollator,
        });
    }

    return cols;
}

export { collatorFactory } from './collatorFactory';
export { headerFactory   } from './headerFactory';
export { rendererFactory } from './rendererFactory';
export default columnCompiler;

import React                    from 'react';
import isString                 from 'lodash/isString';
import { makeStyles }           from '@material-ui/core/styles';
import { rendererFactory }      from './rendererFactory';
import { headerFactory }        from './headerFactory';
import { AnalyzerResults }      from '../analyzer';
import { RowSelectionIndicator, MasterSelectionIndicator }   from '../selectionIndictors';
import { collatorFactory, nullCollator } from './collatorFactory';
import { Column, ColumnSpecifications, ColumnHeaderProps, ColumnRenderProps } from '../column';

const useStyles = makeStyles(theme => ({
    checkbox: {
        color: theme.palette.primary.contrastText,
    }
}))

function Header<T = unknown>({data}: ColumnHeaderProps<T>) {
    const css = useStyles();

    return (
        <MasterSelectionIndicator
            data={data}
            className={css.checkbox}
        />
    );
}

function Render<T = unknown>({datum}: ColumnRenderProps<T>) {
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
            if(isString(column)) {
                return createDefaultColumn(column);
            } else {
                const columnName    = column.name.toString();
                const shape         = getShape();
                const type          = getColumnType(columnName);

                return {
                    name:    columnName,
                    width:   column.width ?? '*',
                    header:  headerFactory(column, type, shape),
                    render:  rendererFactory(column, type, shape),
                    sortBy:  column.sortBy === null ? null : (column.sortBy ?? [column.name]),
                    collate: collatorFactory(column, type, shape),
                } as Column<T>
            }
        })
    :   getKeys().map(key => createDefaultColumn(key));

    if(selection) cols.unshift({
        name: '[selection]',
        width: controlWidth,
        header: Header,
        render: Render,
        sortBy: null,
        collate: nullCollator,
    });

    return cols;
}

export default columnCompiler;
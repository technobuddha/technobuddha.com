import React                                    from 'react';
import clsx                                     from 'clsx';
import { useDerivedValue }                      from '@technobuddha/react-hooks';
import { makeStyles }                           from '@material-ui/core/styles';
import Filterer, { FiltererRenderProps }        from './Filterer';
import Sorter, { SorterRenderProps }            from './Sorter';
import Frame, { FrameRenderProps }              from './Frame';
import Grid, { GridClasses, GridStyles }        from './Grid';
import { ColumnSpecifications }                 from './column';
import columnCompiler                           from './columnCompiler';
import { filterCompiler, FilterSpecification }   from './filterCompiler';
import { RowProvider }                          from './RowContext';
import { MenuFactory }                          from './menu';
import { GridProvider }                         from './GridContext';
import analyzer                                 from './analyzer';

export type DataGridProps<T = unknown> = {
    data:                   T[];
    columns?:               ColumnSpecifications<T>;
    className?:             string;
    style?:                 React.CSSProperties;
    classes?:               DataGridClasses;
    styles?:                DataGridStyles;
    selection?:             boolean;
    selected?:              (datum: T) => boolean;
    filters?:               FilterSpecification<T>[];
    menu?:                  MenuFactory<T>;
    defaultSort?:           string;
    rowHeight?:             number;
    controlWidth?:          number;
    useLocation?:           boolean;
    onSelectionChanged?:    (params: OnSelectionChangedParams<T>) => void;
}

export type DataGridClasses = {
    root?:      string;
    grid?:      GridClasses;
}

export type DataGridStyles = {
    root?:      React.CSSProperties;
    grid?:      GridStyles;
}

export type OnSelectionChangedParams<T = unknown> = {selectedRows: T[], selectedCount: number, unselectedCount: number}

const useDataGridStyles = makeStyles(theme => ({
    root: {
        flex: '1 0 auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderBottom: `1px solid ${theme.palette.divider}`,
    }
}));

export function DataGrid<T = unknown>(
    {data, columns, className, style, classes, styles, selection, selected, filters, menu, defaultSort, rowHeight, controlWidth, useLocation,
     onSelectionChanged}: DataGridProps<T>
) {
    const css               = useDataGridStyles();
    const analysis          = useDerivedValue(() => analyzer(data, columns),   [data, columns]);
    const compiledColumns   = useDerivedValue(
        () => columnCompiler<T>(analysis, selection ?? false, controlWidth ?? 40, columns),
        [analysis, selection, controlWidth, columns]
    );
    const compiledFilters   = useDerivedValue(
        () => (filters ?? []).map(f => filterCompiler(f, data, analysis)),
        [data, analysis, filters]
    );

    return (
        <GridProvider
            data={data}
            defaultSort={defaultSort}
            useLocation={useLocation}
        >
            <RowProvider
                selected={selected}
                onSelectionChanged={onSelectionChanged}
            >
                <Filterer
                    filters={compiledFilters}                  
                >
                    {(filtered: FiltererRenderProps<T>) => (
                        <Sorter
                            data={filtered.data}
                            columns={compiledColumns}
                        >
                            {(sorter: SorterRenderProps<T>) => (
                                <Frame
                                    className={clsx(css.root, className, classes?.root)}
                                    style={{...style, ...styles?.root}}
                                    columns={compiledColumns}
                                    controlWidth={controlWidth ?? 40}
                                    menu={!!menu}
                                >
                                    {(frame: FrameRenderProps) => {
                                        return (
                                            <Grid
                                                data={sorter.data}
                                                columns={compiledColumns}
                                                columnWidths={frame.columnWidths}
                                                rowHeight={rowHeight}
                                                controlWidth={controlWidth ?? 40}
                                                scrollbarWidth={frame.scrollbarWidth}
                                                menu={menu}
                                                filters={compiledFilters}
                                            />
                                        )
                                    }}
                                </Frame>
                            )}
                        </Sorter>
                    )}
                </Filterer>
            </RowProvider>
        </GridProvider>      
    )
}

export default DataGrid;
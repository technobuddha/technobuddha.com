import React                                      from 'react';
import Box                                        from '@material-ui/core/Box';
import { makeStyles }                             from '@material-ui/core/styles';
import clsx                                       from 'clsx';
import { Size }                                   from 'mui-size';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { MenuFactory }                            from './menu';
import Row                                        from './Row';
import RowHeader from './RowHeader';

import type { Column }                from './column';
import type { RowClasses, RowStyles } from './columnStyles';
import type { Filter, FilterActuatorClasses, FilterActuatorStyles, FilterIndicatorClasses, FilterIndicatorStyles } from './filter';
import type { RowRenderer }           from './Row';

const useGridStyles = makeStyles(theme => ({
    actuators: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: theme.palette.grey[700],
    },
    indicators: {
        display: 'flex',
        flexDirection: 'row',
        border: `3px solid ${theme.palette.grey[700]}`,
        padding: theme.spacing(1),
        "&:empty": {
            display: 'none',
        }
    }
}));

export type GridProps<T = unknown> = {
    classes?:               GridClasses;
    styles?:                GridStyles;
    data:                   T[];
    columns:                Column<T>[];
    rowRenderer?:           RowRenderer;
    columnWidths:           number[];
    scrollbarWidth:         number;
    controlWidth:           number;
    rowHeight?:             number;
    filters?:               Filter<T>[],
    menu?:                  MenuFactory<T>;
    children?:              never;
}

export type GridClasses = {
    filter: {
        actuator:   FilterActuatorClasses;
        indicator:  FilterIndicatorClasses;
    },
    area:   GridAreaClasses;
    row:    RowClasses;
    column: RowClasses['column'];
}

export type GridStyles = {
    filter: {
        actuator:   FilterActuatorStyles;
        indicator:  FilterIndicatorStyles;
    }
    area:   GridAreaStyles;
    row:    RowStyles;
    column: RowStyles['column'];
}

type GridAreaClasses = {
    actuators:      string;
    indicators:     string;
    header:         string;
    detail:         string;
}
type GridAreaStyles = {[key in keyof GridAreaClasses]: React.CSSProperties};

function Grid<T = unknown>({classes, styles, rowHeight, scrollbarWidth, controlWidth, data, columns, rowRenderer, columnWidths, filters, menu}: GridProps<T>) {
    const css = useGridStyles();

    const GridRow = (rowProps: ListChildComponentProps) => {
        const datum     = data[rowProps.index];

        return (
            <Row
                classes={classes?.row}
                styles={styles?.row}
                style={rowProps.style}
                index={rowProps.index}
                datum={datum}
                columns={columns}
                rowRenderer={rowRenderer}
                columnWidths={columnWidths}
                rowHeight={rowHeight}
                controlWidth={controlWidth}
                scrollbarWidth={scrollbarWidth}
                menu={menu}
            />
        );
    };

    console.log('Grid rendering...')

    return (
        <>
            {filters &&
                <>
                    <Box
                        className={clsx(css.actuators, classes?.area?.actuators)}
                        style={styles?.area?.actuators}
                    >
                        {filters.map((filter, index) => (
                            <filter.Actuator
                                key={index}
                                classes={classes?.filter?.actuator}
                                styles={styles?.filter?.actuator}
                            />
                        ))}
                    </Box>
                    <Box
                        className={clsx(css.indicators, classes?.area?.indicators)}
                        style={styles?.area?.indicators}
                    >
                        {filters.flatMap((filter, index) => (
                            filter.Indicator
                            ?   <filter.Indicator 
                                    key={index}
                                    classes={classes?.filter?.indicator}
                                    styles={styles?.filter?.indicator}
                                />
                            :   []
                        ))}
                    </Box>
                </>
            }
            <RowHeader
                classes={classes?.row}
                styles={styles?.row}
                data={data}
                columns={columns}
                columnWidths={columnWidths}
                scrollbarWidth={scrollbarWidth}
                rowHeight={32}
                controlWidth={controlWidth}
                menu={menu}
            />
            <Size flexGrow={1}>
                {({width, height}) => (
                    rowHeight
                    ?   <FixedSizeList
                            height={height}
                            width={width}
                            itemCount={data.length}
                            itemSize={rowHeight}
                            layout="vertical"
                        >
                          {GridRow}
                        </FixedSizeList>
                    :   
                    <Box width={width} height={height} style={{overflowX: 'auto'}}>
                        {data.map((datum, index) => (
                            <Row
                                key={index}
                                classes={classes?.row}
                                styles={styles?.row}
                                datum={datum}
                                columns={columns}
                                rowRenderer={rowRenderer}
                                columnWidths={columnWidths}
                                controlWidth={controlWidth}
                                scrollbarWidth={scrollbarWidth}
                                menu={menu}
                            />
                        ))}
                    </Box>
                )}
            </Size>

        </>
    )

}

export default Grid;
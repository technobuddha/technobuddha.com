import React                                        from 'react';
import clsx                                         from 'clsx';
import { FixedSizeList, ListChildComponentProps }   from 'react-window';
import { Size }                                     from 'mui-size';
import Box                                          from '@material-ui/core/Box';
import { makeStyles }                               from '@material-ui/core/styles';
import { Column }                                   from './column';
import Row                                          from './Row';
import { MenuFactory }                              from './menu';
import { RowClasses, RowStyles }                    from './columnStyles';
import { Filter, FilterActuatorClasses, FilterActuatorStyles, FilterIndicatorClasses, FilterIndicatorStyles } from './filter';

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
    column: Record<string, string>;
}

export type GridStyles = {
    filter: {
        actuator:   FilterActuatorStyles;
        indicator:  FilterIndicatorStyles;
    }
    area:   GridAreaStyles;
    row:    RowStyles;
    column: Record<string, React.CSSProperties>;
}

type GridAreaClasses = {
    actuators:      string;
    indicators:     string;
    header:         string;
    detail:         string;
}
type GridAreaStyles = {[key in keyof GridAreaClasses]: React.CSSProperties};

type RowProps = ListChildComponentProps;

function Grid<T = unknown>({classes, styles, rowHeight, scrollbarWidth, controlWidth, data, columns, columnWidths, filters, menu}: GridProps<T>) {
    const css = useGridStyles();

    const GridRow = (rowProps: RowProps) => {
        const datum     = data[rowProps.index];

        return (
            <Row
                classes={classes?.row}
                styles={styles?.row}
                style={rowProps.style}
                index={rowProps.index}
                header={false}
                data={data}
                datum={datum}
                columns={columns}
                columnWidths={columnWidths}
                rowHeight={rowHeight}
                controlWidth={controlWidth}
                scrollbarWidth={scrollbarWidth}
                menu={menu}
            >
                {({column}) => column.render({datum, classes: classes?.column, styles: styles?.column})}
            </Row>
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
            <Row
                classes={classes?.row}
                styles={styles?.row}
                header={true}
                data={data}
                columns={columns}
                columnWidths={columnWidths}
                scrollbarWidth={scrollbarWidth}
                rowHeight={rowHeight}
                controlWidth={controlWidth}
                menu={menu}
                stub={true}
            >
                {({column}) => column.header({data, classes: classes?.row?.header, styles: styles?.row?.header})}
            </Row>
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
                    :   <Box width={width} height={height} style={{overflowX: 'auto'}}>
                            {data.map((datum, index) => (
                                <Row
                                    key={index}
                                    classes={classes?.row}
                                    styles={styles?.row}
                                    header={false}
                                    data={data}
                                    datum={datum}
                                    columns={columns}
                                    columnWidths={columnWidths}
                                    controlWidth={controlWidth}
                                    scrollbarWidth={scrollbarWidth}
                                    menu={menu}
                                >
                                    {({column}) => column.render({datum, classes: classes?.column, styles: styles?.column})}
                                </Row>)
                            )}
                        </Box>
                )}
            </Size>

        </>
    )

}

export default Grid;
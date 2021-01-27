import React               from 'react';
import Box                 from '@material-ui/core/Box';
import IconButton          from '@material-ui/core/IconButton';
import MenuIcon            from '@material-ui/icons/MoreVert';
import clsx                from 'clsx';
import { useColumnStyles } from './columnStyles';

import type { Column }             from './column';
import type { RowClasses, RowStyles } from './columnStyles';
import type { MenuFactory }           from './menu';

export type RowRenderer<T = unknown> =
(args: {
    datum: T;
    height?: number;
    width: number[];
    cellClasses?: string;
    cellStyles?: React.CSSProperties;
    columnClasses?: Record<string, string>;
    columnStyles?: Record<string, React.CSSProperties>;
}) => React.ReactElement;

export type RowProps<T = unknown> = {
    datum:                  T;
    index?:                 number;
    columns:                Column<T>[];
    rowRenderer?:           RowRenderer<T>;
    columnWidths:           number[];
    scrollbarWidth:         number;
    controlWidth:           number;
    rowHeight?:             number;
    menu?:                  MenuFactory<T>;
    className?:             string;
    style?:                 React.CSSProperties;
    classes?:               RowClasses;
    styles?:                RowStyles;
    children?:              never;
};

export type RowRenderProps<T = unknown> = {
    column:        Column<T>;
    index:         number;
};

export function Row<T = unknown>(
    { datum, index, columns, rowRenderer, columnWidths, scrollbarWidth, controlWidth, rowHeight, menu, className, style, classes, styles }: RowProps<T>
) {
    const css = useColumnStyles({ scrollbarWidth, controlWidth });

    const handleMenuClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        menu?.({ event, datum, index });
    };

    return (
        <Box
            className={clsx(css.root, className, classes?.root)}
            style={{ ...styles?.root, ...style }}
        >
            {
                rowRenderer
                    ?   rowRenderer({
                            datum,
                            height: rowHeight,
                            width: columnWidths,
                            cellClasses: clsx(css.cell, classes?.cell),
                            cellStyles: styles?.cell,
                            columnClasses: classes?.column,
                            columnStyles: styles?.column,
                        })
                    :   (columns.map(
                            (column, i) => (
                                <Box
                                    key={column.name}
                                    height={rowHeight}
                                    width={columnWidths[i]}
                                    className={clsx(css.cell, classes?.cell)}
                                    style={{ ...styles?.cell }}
                                >
                                    {column.render({ datum, classes: classes?.column, styles: styles?.column })}
                                </Box>
                            )
                        ))
            }
            {menu &&
                <Box
                    key="[menu]"
                    height={rowHeight}
                    width={`${controlWidth}px`}
                    className={clsx(css.cell, classes?.cell)}
                    style={{ ...styles?.cell }}
                >
                    <IconButton
                        className={clsx(css.menuButton, classes?.menuButton)}
                        style={styles?.menuButton}
                        onClick={handleMenuClick}
                        size="small"
                    >
                        <MenuIcon
                            className={clsx(css.menuIcon, classes?.menuIcon)}
                            style={{ ...styles?.menuIcon }}
                        />
                    </IconButton>
                </Box>
            }
        </Box>
    );
}

export default Row;

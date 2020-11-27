import React            from 'react';
import clsx             from 'clsx';
import Box              from '@material-ui/core/Box';
import IconButton       from '@material-ui/core/IconButton';
import MenuIcon         from '@material-ui/icons/MoreVert';
import { Column }       from './column';
import { MenuFactory }  from './menu';
import { useColumnStyles, RowClasses, RowStyles } from './columnStyles';

type RowProps<T = unknown> = {
    header:                 boolean;
    datum?:                 T;
    data?:                  T[];
    index?:                 number;
    columns:                Column<T>[];
    columnWidths:           number[];
    scrollbarWidth:         number;
    controlWidth:           number;
    rowHeight?:             number;
    menu?:                  MenuFactory<T>;
    className?:             string;
    style?:                 React.CSSProperties;
    classes?:               RowClasses;
    styles?:                RowStyles;
    stub?:                  boolean;
    children:               (props: RowRenderProps<T>) => React.ReactElement;
};

export type RowRenderProps<T = unknown> = {
    column:        Column<T>;
    index:         number;
}

export function Row<T = unknown>(
    {header, datum, data, index, columns, columnWidths, scrollbarWidth, controlWidth, rowHeight, menu, className, style, classes, styles, stub, children}: RowProps<T>
) {
    const css = useColumnStyles({scrollbarWidth, controlWidth});

    const handleMenuClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        menu?.({event, data, datum, index})
    }

    return (
        <Box 
            className={clsx(css.root, className, classes?.root)}
            style={{...styles?.root, ...style}}
        >
            {(columns.map(
                (column, index) => (
                    <Box 
                        key={column.name}
                        height={rowHeight}
                        width={columnWidths[index]}
                        className={clsx(css.cell, classes?.cell, header && css.cellHeader, header && classes?.cellHeader)}
                        style={{...styles?.cell, ...(header && styles?.cellHeader)}}
                    >
                        {children({column, index})}
                    </Box>
                )
            ))}
            {menu &&
                <Box
                    key="[menu]"
                    height={rowHeight}
                    width={`${controlWidth}px`}
                    className={clsx(css.cell, classes?.cell, header && css.cellHeader, header && classes?.cellHeader)}
                    style={{...styles?.cell, ...(header && styles?.cellHeader)}}
                >
                    <IconButton
                        className={clsx(css.menuButton, classes?.menuButton)}
                        style={styles?.menuButton}
                        onClick={handleMenuClick}
                        size="small"
                    >
                        <MenuIcon
                            className={clsx(css.menuIcon, classes?.menuIcon, header && css.menuIconHeader, header && classes?.menuIconHeader)}
                            style={{...styles?.menuIcon, ...(header && styles?.menuIconHeader)}}
                        />
                    </IconButton>
                </Box>
           }
           {stub &&
                <Box
                    key="[stub]"
                    width={`${scrollbarWidth}px`}
                    className={clsx(css.cell, css.stub, classes?.cell, header && css.cellHeader, header && classes?.cellHeader)}
                    style={{...styles?.cell, ...styles?.stub, ...(header && styles?.cellHeader)}}
                >
                    {'\u00A0'}
                </Box>
            }
        </Box>
    )
}

export default Row;

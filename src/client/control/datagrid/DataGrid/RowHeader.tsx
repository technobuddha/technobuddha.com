import React               from 'react';
import Box                 from '@material-ui/core/Box';
import IconButton          from '@material-ui/core/IconButton';
import MenuIcon            from '@material-ui/icons/MoreVert';
import clsx                from 'clsx';
import { useColumnStyles } from './columnStyles';

import type { Column }             from './column';
import type { RowClasses, RowStyles } from './columnStyles';
import type { MenuFactory }           from './menu';

export type RowHeaderProps<T = unknown> = {
    data:                   T[];
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
    children?:              never;
};

export function RowHeader<T = unknown>(
    {data, index, columns, columnWidths, scrollbarWidth, controlWidth, rowHeight, menu, className, style, classes, styles}: RowHeaderProps<T>
) {
    const css = useColumnStyles({scrollbarWidth, controlWidth});

    const handleMenuClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        menu?.({event, data, index})
    }

    return (
        <Box 
            className={clsx(css.root, className, classes?.root)}
            style={{...styles?.root, ...style}}
        >
            {
                (columns.map(
                    (column, index) => (
                        <Box 
                            key={column.name}
                            height={rowHeight}
                            width={columnWidths[index]}
                            className={clsx(css.cell, classes?.cell, css.cellHeader, classes?.cellHeader)}
                            style={{...styles?.cell, ...styles?.cellHeader}}
                        >
                            {column.header({data, classes: classes?.header, styles: styles?.header})}
                        </Box>
                    )
                ))
            }
            {menu &&
                <Box
                    key="[menu]"
                    height={rowHeight}
                    width={`${controlWidth}px`}
                    className={clsx(css.cell, classes?.cell, css.cellHeader, classes?.cellHeader)}
                    style={{...styles?.cell, ...styles?.cellHeader}}
                >
                    <IconButton
                        className={clsx(css.menuButton, classes?.menuButton)}
                        style={styles?.menuButton}
                        onClick={handleMenuClick}
                        size="small"
                    >
                        <MenuIcon
                            className={clsx(css.menuIcon, classes?.menuIcon, css.menuIconHeader, classes?.menuIconHeader)}
                            style={{...styles?.menuIcon, ...(styles?.menuIconHeader)}}
                        />
                    </IconButton>
                </Box>
            }
            <Box
                key="[stub]"
                width={`${scrollbarWidth}px`}
                className={clsx(css.cell, css.stub, classes?.cell, css.cellHeader, classes?.cellHeader)}
                style={{...styles?.cell, ...styles?.stub, ...styles?.cellHeader}}
            >
                {'\u00A0'}
            </Box>
        </Box>
    )
}

export default RowHeader;

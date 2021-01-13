import React                    from 'react';
import Box                      from '@material-ui/core/Box';
import { makeStyles }           from '@material-ui/core/styles';
import { useDerivedState }      from '@technobuddha/react-hooks';
import clsx                     from 'clsx';
import DataGrid                 from '../DataGrid/DataGrid';
import TransferButtons          from './TransferButtons';

import type { OnSelectionChangedParams, DataGridClasses, DataGridStyles }     from '../DataGrid/DataGrid';
import type { FilterSpecification }                                           from '../DataGrid/filterCompiler';
import type { ColumnSpecification }                                           from '../DataGrid/column';
import type { SortKey }                                                       from '../DataGrid/Sorter';
import type { DispatchFunction, TransferButtonClasses, TransferButtonStyles } from './TransferButtons';

function not<T = unknown>(a: T[], b: T[]) {
    return a.filter(value => b.indexOf(value) === -1);
}

export type TransferProps<T = unknown> = {
    className?:     string;
    style?:         React.CSSProperties;
    classes?:       TransferClasses;
    styles?:        TransferStyles;
    rowHeight?:     number;
    left:           T[];
    right:          T[];
    name:           string;
    title?:         string;
    onTransfer?:    (left: T[], right: T[]) => void;
    children?:      never;
}

type TransferClasses = TransferClassesBase & {
    grid: DataGridClasses,
    buttons: TransferButtonClasses,
}

type TransferStyles = TransferStylesBase & {
    grid: DataGridStyles,
    buttons: TransferButtonStyles,
}

type TransferClassesBase = {
    root: string;
    gridBox: string;
    buttonsBox: string;
}
type TransferStylesBase = {[key in keyof TransferClassesBase]: React.CSSProperties};

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        width: 640,
        height: 480,
    },
    gridBox: {
        flexGrow: 1,
    }
});

export function Transfer<T = unknown>(
    {left: leftProp, right: rightProp, rowHeight, name, title, onTransfer, className, style, classes, styles}: TransferProps<T>) {
    const css               = useStyles();
    const dispatch          = React.useRef<DispatchFunction>(null!);
    const [left, setLeft]   = useDerivedState(leftProp,                                                                     [leftProp]);
    const [right, setRight] = useDerivedState(rightProp,                                                                    [rightProp]);
    const selected          = React.useMemo(() => ({left: [] as T[], right: [] as T[]}),                                    [leftProp, rightProp]);
    const columns           = React.useMemo(() => [{name} as ColumnSpecification<T>],                                       [name]);
    const clearR            = React.useRef<() => void>();
    const clearL            = React.useRef<() => void>();
    const filtersR          = React.useMemo(() => [{type: 'search', name, title: title ?? name, clear: clearR} as FilterSpecification<T>], [name, title]);
    const filtersL          = React.useMemo(() => [{type: 'search', name, title: title ?? name, clear: clearL} as FilterSpecification<T>], [name, title]);
    const isLeftSelected    = React.useCallback((datum: T) => selected.left.includes(datum),                                [selected]);
    const isRightSelected   = React.useCallback((datum: T) => selected.right.includes(datum),                               [selected]);

    const handleSelectionChangedLeft    = React.useCallback(
        ({selectedRows, selectedCount, unselectedCount}: OnSelectionChangedParams<T>) => {
            selected.left = selectedRows;
            dispatch.current?.({
                rAll: (selectedCount + unselectedCount) === 0,
                rSel: selectedCount === 0,
            });
        },
        [selected]
    );
    const handleSelectionChangedRight   = React.useCallback(
        ({selectedRows, selectedCount, unselectedCount}: OnSelectionChangedParams<T>) => {
            selected.right = selectedRows;
            dispatch.current?.({
                lSel: selectedCount === 0,
                lAll: (selectedCount + unselectedCount) === 0,
            })
        },
        [selected]
    );
    const handleAllRight                = React.useCallback(
        () => {
            const newLeft:  T[] = [];
            const newRight: T[] = [...right, ...left];

            setLeft(newLeft);
            setRight(newRight);

            selected.right  = [...selected.right, ...selected.left];
            selected.left   = [];

            onTransfer?.(newLeft, newRight);
            clearR.current?.();
        },
        [left, right, selected, onTransfer]
    );
    const handleSelectedRight           = React.useCallback(
        () => {
            const newLeft:  T[] = not(left, selected.left);
            const newRight: T[] = [...right, ...selected.left];

            setLeft(newLeft);
            setRight(newRight);

            selected.right = [...selected.right, ...selected.left];
            selected.left  = [];

            onTransfer?.(newLeft, newRight);
            clearL.current?.();
        },
        [left, right, selected, onTransfer]
    );
    const handleSelectedLeft            = React.useCallback(
        () => {
            const newLeft:  T[] = [...left, ...selected.right];
            const newRight: T[] = not(right, selected.right);

            setLeft(newLeft);
            setRight(newRight);

            selected.left  = [...selected.left, ...selected.right];
            selected.right = [];

            onTransfer?.(newLeft, newRight);
            clearR.current?.();
        },
        [left, right, selected, onTransfer]
    );
    const handleAllLeft             = React.useCallback(
        () => {
            const newLeft:  T[] = [...left, ...right];
            const newRight: T[] = [];

            setLeft(newLeft);
            setRight(newRight);

            selected.left  = [...selected.left, ...selected.right];
            selected.right = [];

            onTransfer?.(newLeft, newRight);
            clearL.current?.();
        },
        [left, right, selected, onTransfer]
    );

    return (
        <Box
            className={clsx(css.root, className, classes?.root)}
            style={{...style, ...styles?.root}}
        >
            <Box
                className={clsx(css.gridBox, classes?.gridBox)}
                style={styles?.gridBox}
                flexGrow={1}
            >
                <DataGrid
                    classes={classes?.grid}
                    rowHeight={rowHeight}
                    styles={styles?.grid}
                    selection={true}
                    selected={isLeftSelected}
                    data={left}
                    columns={columns}
                    filters={filtersR}
                    defaultSort={name as SortKey<T>}
                    onSelectionChanged={handleSelectionChangedLeft}
                />
            </Box>
            <Box
                className={classes?.buttonsBox}
                style={styles?.buttonsBox}
            >
                <TransferButtons
                    classes={classes?.buttons}
                    styles={styles?.buttons}
                    dispatch={dispatch}
                    onRAllClick={handleAllRight}
                    onRSelClick={handleSelectedRight}
                    onLSelClick={handleSelectedLeft}
                    onLAllClick={handleAllLeft}
                />
            </Box>
            <Box
                className={clsx(css.gridBox, classes?.gridBox)}
                style={styles?.gridBox}
            >
                <DataGrid
                    classes={classes?.grid}
                    rowHeight={rowHeight}
                    styles={styles?.grid}
                    selection={true}
                    selected={isRightSelected}
                    data={right}
                    columns={columns}
                    filters={filtersL}
                    defaultSort={name as SortKey<T>}
                    onSelectionChanged={handleSelectionChangedRight}
                />
            </Box>
        </Box>
    )
}

export default Transfer;

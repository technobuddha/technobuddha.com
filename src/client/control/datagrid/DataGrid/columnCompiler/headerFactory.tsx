import React            from 'react';
import { makeStyles }   from '@material-ui/core/styles';
import Button           from '@material-ui/core/Button';
import Box              from '@material-ui/core/Box';
import SortNone         from '@material-ui/icons/UnfoldMore';
import SortDesc         from '@material-ui/icons/ExpandLess';
import SortAsc          from '@material-ui/icons/ExpandMore';
import clsx             from 'clsx';
import isString         from 'lodash/isString';
import isUndefined      from 'lodash/isUndefined';
import { useGrid }      from '../GridContext';

import type { Shape }                                              from '../analyzer';
import type { ColumnSpecification, ColumnType, ColumnHeaderProps } from '../column';
import type { SortKey }                                            from '../Sorter';

const useHeaderStyles = makeStyles(theme => ({
    button: {
        padding: '4px 0',
        borderRadius: 0,
        backgroundColor: theme.palette.primary.light,
    },
    buttonContents: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    buttonTitle: {
        flexGrow: 1,
    },
    buttonSortIndicator: {
        position: 'relative',
        top: '2px',
        width: '18px',
        height: '18px',
    },
}));

export function headerFactory<T = unknown>(column: ColumnSpecification<T>, _type: ColumnType, _shape: Shape) {
    if(isString(column.header) || isUndefined(column.header)) {
        const text = column.header ?? column.name;

        return ({classes, styles}: ColumnHeaderProps<T>) => {
            const css                   = useHeaderStyles();
            const { sort, changeSort }  = useGrid<T>();

            return (
                <Button 
                    className={clsx(css.button, classes?.button)}
                    style={styles?.button}
                    fullWidth
                    disableElevation
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={column.sortBy === null ? undefined : (() => changeSort(column.name.toString() as SortKey<T>))}
                >
                    <Box
                        className={clsx(css.buttonContents, classes?.buttonContents)}
                        style={styles?.buttonContents}
                    >
                        <Box
                            className={clsx(css.buttonTitle, classes?.buttonTitle)}
                            style={styles?.buttonTitle}
                        >
                            {text}
                        </Box>
                        {column.sortBy !== null && (
                            sort?.sortBy === column.name
                            ?   sort?.sortAscending
                                ?   <SortAsc
                                        className={clsx(css.buttonSortIndicator, classes?.buttonSortIndicator)}
                                        style={styles?.buttonSortIndicator}
                                    />
                                :   <SortDesc
                                        className={clsx(css.buttonSortIndicator, classes?.buttonSortIndicator)}
                                        style={styles?.buttonSortIndicator}
                                    />
                            :   <SortNone
                                    className={clsx(css.buttonSortIndicator, classes?.buttonSortIndicator)}
                                    style={styles?.buttonSortIndicator}
                                />
                        )}
                    </Box>
                </Button>
            );
        }
    } else
        return column.header;
}

export default headerFactory;
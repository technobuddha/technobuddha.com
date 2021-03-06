import React                    from 'react';
import Grid                     from '@material-ui/core/Grid';
import TextField                from '@material-ui/core/TextField';
import { makeStyles }           from '@material-ui/core/styles';
import Search                   from '@material-ui/icons/Search';
import Clear                    from '@material-ui/icons/Clear';
import { useGrid }              from '../../GridContext';
import { searchExecute }        from './execution';
import { normalizeFilterValue } from './normalization';

import type { AnalyzerResults } from '../../analyzer';
import type { Filter }          from '../../filter';
import type { CompilerOptions } from './options';

export type SearchCompilerOptions<T = unknown> = CompilerOptions & {
    type:       'search';
    name:       keyof T;
    title:      string;
};

const useSearchStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
    },
    gridIcon: {
        position: 'relative',
        top: -2,
    },
    gridText: {
        flexGrow: 1,
    },
    textfield: {
        width: '100%',
        '& fieldset': {
            border: 'none',
        },
    },
    clear: {
        fontSize: '1.0rem',
        marginBottom: '0.25rem',
        cursor: 'pointer',
    },
}));

export function filterCompilerSearch<T = unknown>({ name, title, clear }: SearchCompilerOptions<T>, { getShape }: AnalyzerResults<T>): Filter<T> {
    return {
        name,
        Actuator:  () => {
            const css                               = useSearchStyles();
            const { changeFilter, filterValues }    = useGrid<T>();
            const [ search, setSearch ]             = React.useState(normalizeFilterValue(filterValues[name]));
            const timer                             = React.useRef<number>();

            const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value ?? undefined;

                if(timer.current)
                    clearTimeout(timer.current);

                setSearch(value ?? '');
                timer.current = window.setTimeout(
                    () => {
                        changeFilter(name, value);
                        timer.current = undefined;
                    },
                    1000
                );
            };

            const handleClearClick = () => {
                changeFilter(name, '');
                setSearch('');
            };
            if(clear)
                clear.current = handleClearClick;

            return (
                <Grid
                    className={css.root}
                    container={true}
                    alignItems="flex-end"
                >
                    <Grid
                        className={css.gridIcon}
                        item={true}
                    >
                        <Search />
                    </Grid>
                    <Grid item={true} className={css.gridText}>
                        <TextField
                            className={css.textfield}
                            size="small"
                            placeholder={title}
                            variant="outlined"
                            onChange={handleChange}
                            value={search}
                        />
                    </Grid>
                    <Grid
                        className={css.gridIcon}
                        item={true}
                    >
                        {
                            search !== '' &&
                            <Clear
                                className={css.clear}
                                onClick={handleClearClick}
                            />
                        }
                    </Grid>
                </Grid>

            );
        },
        execute: searchExecute(name, getShape()),
    };
}

export default filterCompilerSearch;

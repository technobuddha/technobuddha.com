import React                    from 'react';
import TextField                from '@material-ui/core/TextField';
import Grid                     from '@material-ui/core/Grid';
import Search                   from '@material-ui/icons/Search';
import Clear                    from '@material-ui/icons/Clear';
import { makeStyles }           from '@material-ui/core/styles';
import { useGrid }              from '../GridContext';
import { Filter }               from '../filter';
import { AnalyzerResults }      from '../analyzer';
import { searchExecute }        from './execution';
import { normalizeFilterValue } from './normalization';

export type FilterFactorySearchOptions<T = unknown> = {
    type:       'search';
    name:       keyof T;
    title:      string;
    clear?:     React.MutableRefObject<() => void>;     // TODO implement clear for other types...  maybe make it a base type member
};

const useSearchStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`
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
        "& fieldset": {
            border: 'none',
        },
    },
    clear: {
        fontSize: '1.0rem',
        marginBottom: '0.25rem',
        cursor: 'pointer',
    }
}));

export function filterCompilerSearch<T = unknown>({name, title, clear}: FilterFactorySearchOptions<T>, { getShape }: AnalyzerResults<T>): Filter<T> {
    return {
        name,
        Actuator:  () => {
            const css                               = useSearchStyles();
            const { changeFilter, filterValues }    = useGrid<T>();
            const [ search, setSearch ]             = React.useState(normalizeFilterValue(filterValues[name]));
            const timer                             = React.useRef<number>()

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
            }

            const handleClearClick = () => {
                changeFilter(name, '');
                setSearch('');
            }
            if(clear)
                clear.current = handleClearClick;

            return (
                <Grid
                    className={css.root}
                    container
                    alignItems="flex-end"
                >
                    <Grid
                        className={css.gridIcon}
                        item
                    >
                        <Search />
                    </Grid>
                    <Grid item className={css.gridText}>
                        <TextField
                            className={css.textfield}
                            size="small"
                            placeholder={title ?? name}
                            variant="outlined"
                            onChange={handleChange}
                            value={search}
                        />  
                    </Grid>
                    <Grid
                        className={css.gridIcon}
                        item
                    >
                        {search !== '' &&
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
    }
}
    

export default filterCompilerSearch;

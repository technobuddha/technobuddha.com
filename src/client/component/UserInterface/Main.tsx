import React                from 'react';
import Box                  from '@material-ui/core/Box';
import { Route, Switch }    from '#context/router';
import { makeStyles }       from '#context/mui';
import usePages             from '#context/pages';

type MainProps = {
    children?: never;
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    }
});

export const Content: React.FC<MainProps> = () => {
    const css   = useStyles();
    const pages = usePages();

    return (
        <Box className={css.root}>
            <Switch>
                {
                    pages.map((page, i) => (
                        <Route key={i} path={page.location} component={page.component}  />
                    ))
                }
                <Route>
                    Catch-all route
                </Route>
            </Switch>
        </Box>
    );
}

export default Content;

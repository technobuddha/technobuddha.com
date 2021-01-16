import React                from 'react';
import Box                  from '@material-ui/core/Box';
import { Route, Switch }    from '#context/router';
import { makeStyles }       from '#context/mui';
import usePages             from '#context/component';

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
    const components = usePages();

    return (
        <Box className={css.root}>
            <Switch>
                {
                    components.map((component, i) => (
                        <Route key={i} path={component.location} component={component.component}  />
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

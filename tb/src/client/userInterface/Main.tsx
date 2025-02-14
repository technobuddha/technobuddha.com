import React                from 'react';
import Box                  from '@material-ui/core/Box';
import { Route, Switch }    from '#context/router';
import useComponents        from '#context/component';
import css                  from './Main.css';

type MainProps = {
    children?: never;
};

export const Main: React.FC<MainProps> = () => {
    const components = useComponents();

    return (
        <Box className={css.main}>
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
};

export default Main;

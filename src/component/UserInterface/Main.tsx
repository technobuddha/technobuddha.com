import React                from 'react';
import Box                  from '@material-ui/core/Box';
import Home                 from '#component/Home';
import NBody                from '#component/NBody';
import Music                from '#component/Music';
import Knight               from '#component/Knight';
import Life                 from '#component/Life';
import Chaos                from '#component/Chaos';
import { Route, Switch }    from '#context/router';
import { makeStyles }       from '#context/mui';

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
    const css = useStyles();

    return (
        <Box className={css.root}>
            <Switch>
                <Route path="/home"     component={Home}  />
                <Route path="/music"    component={Music} />
                <Route path="/life"     component={Life} />
                <Route path="/nbody"    component={NBody} />
                <Route path="/chaos"    component={Chaos} />
                <Route path="/knight"   component={Knight} />
                <Route>
                    Catch-all route
                </Route>
            </Switch>
        </Box>
    );
}

export default Content;

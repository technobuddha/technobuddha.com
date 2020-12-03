
import React                        from 'react';
import { makeStyles }               from '#context/mui';
import {Route, Switch/*, ErrorRoute */, Redirect}  from '#context/router';
import Box                          from '$client/control/Box';
import Nav                          from './Nav';
import Header                       from './Header';
import Main                         from './Main';
import Footer                       from './Footer';
import CssBaseLine                  from '@material-ui/core/CssBaseline';
import Authentication               from '$client/component/Authentication';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    },
    frame: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    }
})

export const UserInterface: React.FC = () => {
    const css = useStyles();

    return (
        <>
            <CssBaseLine />
            <Box className={css.root}>
                <Switch>
                    {/* <ErrorRoute component={SiteUnavailable} /> */}
                    <Route exact path={['/login', '/sign-up', '/forgot-password']} component={Authentication}/>
                    <Route exact path='/'><Redirect to="/home"/></Route>
                    <Route>
                        <Nav />
                        <Box className={css.frame}>
                            <Header />
                            <Main />
                            <Footer/>            
                        </Box>
                    </Route>
                </Switch>
            </Box>
        </>

    );
}

export default UserInterface;

import React                        from 'react';
import uiSettings                   from '#settings/user-interface';
import authSettings                 from '#settings/authentication';
import { Route, Switch, Redirect }  from '#context/router';
import useAuthentication            from '#context/authentication';
import Box                          from '@material-ui/core/Box';
import Nav                          from './Nav';
import Header                       from './Header';
import Main                         from './Main';
import Footer                       from './Footer';
import CssBaseLine                  from '@material-ui/core/CssBaseline';
import Authentication               from '#client/authentication';
import css                          from './UserInterface.css';

export const UserInterface: React.FC = () => {
    const authentication = useAuthentication();

    return (
        <>
            <CssBaseLine />
            <Box className={css.userInterface}>
                <Switch>
                    <Route exact={true} path={[ '/login', '/sign-up', '/forgot-password' ]} component={Authentication} />
                    <Route exact={true} path="/"><Redirect to={uiSettings.homePage} /></Route>
                    {
                        (!authSettings.login || authentication.account) &&
                        <Route>
                            <Nav />
                            <Box className={css.frame}>
                                <Header />
                                <Main />
                                <Footer />
                            </Box>
                        </Route>
                    }
                    <Redirect to="/login" />
                </Switch>
            </Box>
        </>

    );
};

export default UserInterface;

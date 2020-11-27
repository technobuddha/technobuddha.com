import React                        from 'react';
import {Route, Switch/*, ErrorRoute */, Redirect}  from '$client/context/router';
import Box                          from '$client/control/Box';
//import SiteUnavailable              from '$client/component/SiteUnavailable';
import Authentication               from '$client/component/Authentication';
import UserInterface                from '$client/component/UserInterface';
import CssBaseLine                  from '@material-ui/core/CssBaseline';

export const Body: React.FC = () => {
    return (
        <>
            <CssBaseLine />
            <Box height="100%" width="100%" overflow="hidden">
                <Switch>
                    {/* <ErrorRoute component={SiteUnavailable} /> */}
                    <Route exact path={['/login', '/sign-up', '/forgot-password']} component={Authentication}/>
                    <Route exact path='/'><Redirect to="/home"/></Route>
                    <Route component={UserInterface} />
                </Switch>
            </Box>
        </>
    );
}

export default Body;

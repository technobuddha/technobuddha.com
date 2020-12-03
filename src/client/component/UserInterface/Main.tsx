import React                from 'react';
import Box                  from '@material-ui/core/Box';
import Home                 from '$client/component/Home';
import NBody                from '$client/component/NBody';
import Music                from '$client/component/Music';
//import Knight               from '$client/component/Knight';
import Life                 from '$client/component/Life';
import Chaos                from '$client/component/Chaos';
import Authentication       from '$client/component/Authentication';

import { Route, Switch }    from '#context/router';

export const Content: React.FC = () => {
    return (
        <Box flexGrow={1} component="main" padding={1} display="flex" flexDirection="column">
            <Switch>
                <Route path="/home"     component={Home}  />
                <Route path="/music"    component={Music} />
                {/* <Route path="/knight"   component={Knight} /> */}
                <Route path="/life"     component={Life} />
                <Route path="/nbody"    component={NBody} />
                <Route path="/chaos"    component={Chaos} />
                <Route path={['/login', '/sign-up']} component={Authentication} />
                <Route path="/one">
                    Pellentesque in ipsum id orci porta dapibus. Donec rutrum congue leo eget malesuada. Donec sollicitudin molestie malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Nulla porttitor accumsan tincidunt. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Cras ultricies ligula sed magna dictum porta. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
                </Route>
                <Route>
                    Catch-all route
                </Route>
            </Switch>
        </Box>
    );
}

export default Content;

import React                from 'react';
import { Route, Switch }    from 'react-router-dom';
import Box                  from '$client/control/Box';
import NBody                from '$client/component/NBody';
import Music                from '$client/component/Music';
import { useHistory }       from '$client/context/router';

export const Content: React.FC = () => {
    const history  = useHistory();

    return (
        <Box flexGrow={1} component="main" padding={1} display="flex" flexDirection="column">
            <Switch>
                <Route path="/home">
                    Donec rutrum congue leo eget malesuada. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Donec rutrum congue leo eget malesuada. Nulla quis lorem ut libero malesuada feugiat. Proin eget tortor risus. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Proin eget tortor risus.
                </Route>
                <Route path="/music" component={Music} />
                <Route path="/nbody" component={NBody} />
                <Route path="/one">
                    Pellentesque in ipsum id orci porta dapibus. Donec rutrum congue leo eget malesuada. Donec sollicitudin molestie malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Nulla porttitor accumsan tincidunt. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Cras ultricies ligula sed magna dictum porta. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
                </Route>
                <Route>
                    ? I don&apos;t know ? {JSON.stringify(history)}
                </Route>
            </Switch>
        </Box>
    );
}

export default Content;

import React                                        from 'react';
// import useAuthentication                         from '$client/context/authentication';
import { createBrowserHistory, Location, History }  from 'history';
import {
    Router as ReactRouter,
    //Route,
    //RouteProps,
    useHistory as routerUseHistory,
    //Redirect,
} from 'react-router-dom';

type HistoryState = { referrer: Location<HistoryState> }

const history = createBrowserHistory();

export const Router: React.FC = ({children}: {children?: React.ReactNode}) => {
    return (
        <ReactRouter history={history}>
            {children}
        </ReactRouter>
    );
}

// export const AuthenticatedRoute: React.FC<RouteProps> = (props: RouteProps) => {
//     // const { account }   = useAuthentication();
//     const history       = useHistory();

//     return (
//         // account
//         // ?   <Route {...props} /> 
//         /*:*/   <Route>
//                 <Redirect to={{
//                     pathname: "/login",
//                     state: { referrer: history.location }
//                 }}/>
//             </Route>
//     )
// }

// type ErrorProps = Omit<RouteProps, 'path' | 'exact' | 'strict' | 'location' | 'sensitive'>;
// export const ErrorRoute: React.FC<ErrorProps> = (props: ErrorProps) => {
//     //const { error } = useAuthentication();

//     return /*error ? <Route {...props} /> :*/ null;
// }

export const useHistory = () => {
    return routerUseHistory() as History<HistoryState>;
}

export { Location }                         from 'history';
export { Route, Switch, Redirect, Link }    from 'react-router-dom';
export default useHistory;
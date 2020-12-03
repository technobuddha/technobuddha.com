import React                                        from 'react';
// import useAuthentication                         from '#context/authentication';
import { Location, History }  from 'history';
import {
    BrowserRouter,
    useHistory as routerUseHistory,
} from 'react-router-dom';

type HistoryState = { referrer: Location<HistoryState> }

export const Router: React.FC = ({children}: {children?: React.ReactNode}) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
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

export { Location }                                 from 'history';
export { Route, Switch, Redirect, useLocation }     from 'react-router-dom';

export default useHistory;
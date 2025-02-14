import React                                             from 'react';
import { BrowserRouter, useHistory as routerUseHistory } from 'react-router-dom';

import type { Location, History } from 'history';

type HistoryState = { referrer: Location<HistoryState> };

export const Router: React.FC = ({ children }: { children?: React.ReactNode }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
};

export const useHistory = (): History<HistoryState>  => {
    return routerUseHistory<HistoryState>();
};

export type { Location } from 'history';
export { Route, Switch, Redirect, useLocation, useParams, useRouteMatch } from 'react-router-dom';

export default useHistory;

import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Switch, Route, Redirect, useRouteMatch, useHistory } from '#context/router';
import css from './TabbedRouter.css';

type TabPanelProps = {
    content: React.ComponentType;
    children?: never;
    [key: string]: unknown;
};

const TabPanel: React.FC<TabPanelProps> = ({ content: Content, value, index, ...other }) => {
    return (
        <div
            className={css.panel}
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-tabpanel-${index}`}
            aria-labelledby={`scrollable-tab-${index}`}
            {...other}
        >
            <Content />
        </div>
    );
};

type TabbedRouterProps = {
    tabs: {
        url: string;
        label: string;
        icon: React.ReactElement;
        content: React.ComponentType;
    }[];
};

export const TabbedRouter: React.FC<TabbedRouterProps> = ({ tabs }) => {
    const match = useRouteMatch();
    const history = useHistory();

    const handleChange = (_event: React.ChangeEvent<{}>, newValue: any) => {
        history.push(newValue);
    };

    return (
        <Switch>
            <Route exact={true} path={match.path}>
                <Redirect to={`${match.path}/${tabs[0].url}`} />
            </Route>
            <Route path={tabs.map(({ url }) => `${match.path}/${url}`)}>
                <div className={css.root}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={history.location.pathname}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="on"
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            {tabs.map(({ label, icon: Icon, url }, i) => <Tab key={i} value={`${match.path}/${url}`} label={label} icon={Icon} />)}
                        </Tabs>
                    </AppBar>
                    <div className={css.panel}>
                        <Switch>
                            {tabs.map(({ content, url }) => (
                                <Route key={url} path={`${match.path}/${url}`}>
                                    <TabPanel content={content} />
                                </Route>
                            ))}
                        </Switch>
                    </div>
                </div>
            </Route>
            <Route>
                catch-all route
            </Route>
        </Switch>
    );
};

export default TabbedRouter;

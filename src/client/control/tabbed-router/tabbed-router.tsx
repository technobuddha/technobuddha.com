/* eslint-disable react/no-multi-comp */
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { Navigate, Route, Routes, useNavigate, useResolvedPath } from '#context/router';

import css from './tabbed-router.module.css';

type TabPanelProps = {
  readonly content: React.ComponentType;
  readonly children?: never;
  readonly [key: string]: unknown;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const TabPanel: React.FC<TabPanelProps> = ({ content: Content, value, index, ...other }) => (
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

type TabbedRouterProps = {
  readonly tabs: {
    url: string;
    label: string;
    icon: React.ReactElement;
    content: React.ComponentType;
  }[];
};

export const TabbedRouter: React.FC<TabbedRouterProps> = ({ tabs }) => {
  const match = useResolvedPath('');
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: any): void => {
    void navigate(newValue);
  };

  return (
    <Routes>
      <Route path={match.pathname}>
        <Navigate to={`${match.pathname}/${tabs[0].url}`} />
      </Route>
      <Route path={tabs.map(({ url }) => `${match.pathname}/${url}`)}>
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
              {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
              {tabs.map(({ label, icon: Icon, url }, i) => (
                <Tab key={i} value={`${match.pathname}/${url}`} label={label} icon={Icon} />
              ))}
            </Tabs>
          </AppBar>
          <div className={css.panel}>
            <Routes>
              {tabs.map(({ content, url }) => (
                <Route key={url} path={`${match.pathname}/${url}`}>
                  <TabPanel content={content} />
                </Route>
              ))}
            </Routes>
          </div>
        </div>
      </Route>
      <Route>catch-all route</Route>
    </Routes>
  );
};

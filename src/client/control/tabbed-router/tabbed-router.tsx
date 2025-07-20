/* eslint-disable react/no-multi-comp */
import React from 'react';
import { AppBar, Tab, Tabs } from '@mui/material';

import { Navigate, useLocation, useNavigate } from '#context/router';

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

export type TabbedRouterProps = {
  readonly path: string;
  readonly tabs: {
    route: string;
    label: string;
    icon: React.ReactElement;
    content: React.ComponentType;
  }[];
};

export const TabbedRouter: React.FC<TabbedRouterProps> = ({ path, tabs }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const subpath = pathname.startsWith(path) ? pathname.slice(path.length) : pathname;

  const handleChange = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
    (_event: React.ChangeEvent<{}>, newValue: any): void => {
      void navigate(`${path}${newValue}`);
    },
    [navigate, path],
  );

  const tab = tabs.find((t) => t.route === subpath);

  // TODO [2025-07-31]: scrollButtons support

  if (tab) {
    return (
      <div className={css.tabbedRouter}>
        <AppBar position="static" color="default">
          <Tabs
            value={subpath}
            onChange={handleChange}
            variant="scrollable"
            // scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
            {tabs.map(({ label, icon: Icon, route }) => (
              <Tab className={css.tab} key={route} value={route} label={label} icon={Icon} />
            ))}
          </Tabs>
        </AppBar>
        <div className={css.panel}>
          <TabPanel content={tab.content} />
        </div>
      </div>
    );
  }

  return <Navigate to={`${path}${tabs[0].route}`} />;
};

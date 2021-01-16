import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Switch, Route, Redirect, useRouteMatch, useHistory } from '#context/router';
import css from './TabbedRouter.module.pcss';

type TabPanelProps = {
    index: number;
    value: number;
    content: React.ComponentType;
    children?: never;
    [key: string]: unknown;
}

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
}

type TabbedRouterProps = {
    tabs: {
        url: string;
        label: string;
        icon: React.ReactElement;
        content: React.ComponentType;
    }[];
}



export const TabbedRouter: React.FC<TabbedRouterProps> = ({tabs}) => {
  const [value, setValue] = React.useState(0);
  const match = useRouteMatch();
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: any) => {
      setValue(newValue);
      history.push(`${match.url}/${tabs[newValue].url}`)
  };

  return (
    <div className={css.root}>
        <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
                {tabs.map(({label, icon: Icon}, i) => <Tab key={i} label={label} icon={Icon}/>)}
            </Tabs>
        </AppBar>
        <div className={css.panel}>
            <Switch>
                <Route path={`${match.url}/`} exact>
                    <Redirect to={`${match.url}/${tabs[0].url}`} />
                </Route>
                {tabs.map(({content, url}, i) => (
                    <Route key={url} path={`${match.url}/${url}`}>
                        <TabPanel  value={value} index={i} content={content} />
                    </Route>
                ))}
                <Route>
                    Catch-all route
                </Route>
            </Switch>
        </div>
    </div>
  );
}

export default TabbedRouter;

import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import css from './ScrollableTabsButton.module.pcss';

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
          id={`scrollable-force-tabpanel-${index}`}
          aria-labelledby={`scrollable-force-tab-${index}`}
          {...other}
      >
          {value === index && <Content />}
      </div>
  );
}

function a11yProps(index: number) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

type ScrollableTabsButtonProps = {
    tabs: {
        label: string;
        icon: React.ReactElement;
        content: React.ComponentType;
    }[];
}

export const ScrollableTabsButton: React.FC<ScrollableTabsButtonProps> = ({tabs}) => {
  const [value, setValue] = React.useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
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
          aria-label="scrollable force tabs example"//TODO 
        >
            {tabs.map(({label, icon: Icon}, i) => <Tab key={i} label={label} icon={Icon} {...a11yProps(i)} />)}
        </Tabs>
      </AppBar>
      {tabs.map(({content}, i) => <TabPanel key={i} value={value} index={i} content={content} />)}
    </div>
  );
}

export default ScrollableTabsButton;

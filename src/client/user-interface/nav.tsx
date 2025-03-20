import React from 'react';
import clsx from 'clsx';
import { MdMenu } from 'react-icons/md';
import { MdMenuOpen } from 'react-icons/md';

import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useNavigate, useLocation } from '#context/router';
import { makeStyles } from '#context/mui';
import { useComponents } from '#context/component';

const expansionTimeout = 1250;

const useStyles = makeStyles((theme) => {
  const drawerClosedWidth = theme.typography.pxToRem(24 + Number.parseInt(theme.spacing(2)) * 2);
  const drawerOpenedWidth = '25vw';

  return {
    root: {
      width: drawerClosedWidth,
      height: '100',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    buttonBox: {
      height: 40,
      paddingLeft: theme.spacing(0.5),
      backgroundColor: theme.palette.primary.main,
    },
    buttonIcon: {
      color: theme.palette.common.white,
    },
    menu: {
      zIndex: theme.zIndex.modal - 1,
      height: '100%',
      backgroundColor: theme.palette.primary.dark,
      overflow: 'hidden',
      transition: 'width 300ms ease',
    },
    opened: {
      width: drawerOpenedWidth,
    },
    closed: {
      width: drawerClosedWidth,
    },
    listItemText: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    icon: {
      width: '1.5rem',
      height: '1.5rem',
    },
    current: {
      color: theme.palette.secondary.light,
    },
    available: {
      color: theme.palette.common.white,
    },
    primary: {
      color: theme.palette.primary.contrastText,
    },
    secondary: {
      color: `${theme.palette.common.white} !important`,
    },
  };
});

type NavProps = {
  className?: string;
  children?: never;
};

export const Nav: React.FC<NavProps> = ({ className }) => {
  const css = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const components = useComponents();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const timer = React.useRef<number | undefined>(0);

  const cancelTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  };

  const handleListClick = (loc: string) => () => {
    setMenuOpen(false);
    setClicked(true);
    navigate(loc);
    cancelTimer();
  };

  const handleMouseOver = () => {
    cancelTimer();
    if (!clicked)
      timer.current = window.setTimeout(() => {
        setMenuOpen(true);
      }, expansionTimeout);
  };

  const handleMouseLeave = () => {
    setMenuOpen(false);
    setClicked(false);
    cancelTimer();
  };

  const handleMenuClick = () => {
    setMenuOpen((m) => !m);
  };

  return (
    <Box className={clsx(className, css.root)}>
      <Box className={css.buttonBox}>
        <IconButton onClick={handleMenuClick}>
          {menuOpen ?
            <MdMenuOpen className={css.buttonIcon} />
          : <MdMenu className={css.buttonIcon} />}
        </IconButton>
      </Box>
      <Box
        component="nav"
        className={clsx(css.menu, menuOpen ? css.opened : css.closed)}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <List>
          {components.map((component, i) => {
            const Icon = component.icon;
            const current = location.pathname.startsWith(component.location);

            return (
              <ListItem onClick={handleListClick(component.location)} key={i}>
                <ListItemIcon>
                  <Icon
                    className={clsx(css.icon, {
                      [css.current]: current,
                      [css.available]: !current,
                    })}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={component.primary}
                  secondary={component.secondary}
                  classes={{
                    root: css.listItemText,
                    primary: css.primary,
                    secondary: css.secondary,
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

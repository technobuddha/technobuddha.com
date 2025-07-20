import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';
import { MdMenu, MdMenuOpen } from 'react-icons/md';

import { useAuthentication } from '#context/authentication';
import { useTranslation } from '#context/i18n';
import { makeStyles } from '#context/mui';
import { useLocation, useNavigate } from '#context/router';
import { components } from '#settings/components.jsx';

const expansionTimeout = 1250;

// TODO: [2025-07-31] - makeStyles is deprecated, use styled components or sx prop...
// OR fix type errors;

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
  readonly className?: string;
  readonly children?: never;
};

export const Nav: React.FC<NavProps> = ({ className }) => {
  const css = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { account } = useAuthentication();
  const translatedComponents = React.useMemo(
    () => components(t).filter((c) => c.active && (c.loggedIn === false || account != null)),
    [t, account],
  );

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelTimer = (): void => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  };

  const handleListClick = (loc: string) => () => {
    setMenuOpen(false);
    setClicked(true);
    void navigate(loc);
    cancelTimer();
  };

  const handleMouseOver = React.useCallback((): void => {
    cancelTimer();
    if (!clicked) {
      timer.current = setTimeout(() => {
        setMenuOpen(true);
      }, expansionTimeout);
    }
  }, [clicked]);

  const handleMouseLeave = React.useCallback((): void => {
    setMenuOpen(false);
    setClicked(false);
    cancelTimer();
  }, []);

  const handleMenuClick = React.useCallback((): void => {
    setMenuOpen((m) => !m);
  }, []);

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
          {translatedComponents
            ?.filter((c) => c.active)
            .map((component, i) => {
              const Icon = component.icon;
              const current = location.pathname.startsWith(component.location);

              return (
                // eslint-disable-next-line react/no-array-index-key
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

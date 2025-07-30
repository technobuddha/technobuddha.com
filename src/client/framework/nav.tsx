import React from 'react';
import clsx from 'clsx';
import { MdMenu, MdMenuOpen } from 'react-icons/md';

import { useAuthentication } from '#context/authentication';
import { useTranslation } from '#context/i18n';
import { useLocation, useNavigate } from '#context/router';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText } from '#control';
import { components } from '#settings/components.jsx';

import css from './nav.module.css';

const expansionTimeout = 1250;

type NavProps = {
  readonly className?: string;
  readonly children?: never;
};

export const Nav: React.FC<NavProps> = ({ className }) => {
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

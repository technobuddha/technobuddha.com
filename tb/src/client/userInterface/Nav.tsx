import React                from 'react';
import clsx                 from 'clsx';
import Menu                 from '@material-ui/icons/Menu';
import MenuOpen             from '@material-ui/icons/MenuOpen';

import ListItem             from '@material-ui/core/ListItem';
import Box                  from '@material-ui/core/Box';
import List                 from '@material-ui/core/List';
import ListItemIcon         from '@material-ui/core/ListItemIcon';
import ListItemText         from '@material-ui/core/ListItemText';
import IconButton           from '@material-ui/core/IconButton';
import useHistory           from '#context/router';
import { makeStyles }       from '#context/mui';
import useComponents        from '#context/component';

const expansionTimeout = 1250;

const useStyles = makeStyles(theme => {
    const drawerClosedWidth = theme.typography.pxToRem(24 + theme.spacing(2) * 2);
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

export const Nav: React.FC = () => {
    const css       = useStyles();
    const history   = useHistory();
    const components     = useComponents();

    const [ menuOpen, setMenuOpen ] = React.useState(false);
    const [ clicked,  setClicked ]  = React.useState(false);
    const timer                     = React.useRef<number | undefined>();

    const cancelTimer = () => {
        if(timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
        }
    };

    const handleListClick = (location: string) => () => {
        setMenuOpen(false);
        setClicked(true);
        history.push(location);
        cancelTimer();
    };

    const handleMouseOver = () => {
        cancelTimer();
        if(!clicked)
            timer.current = window.setTimeout(() => { setMenuOpen(true); }, expansionTimeout);
    };

    const handleMouseLeave = () => {
        setMenuOpen(false);
        setClicked(false);
        cancelTimer();
    };

    const handleMenuClick = () => { setMenuOpen(m => !m); };

    return (
        <Box className={css.root}>
            <Box className={css.buttonBox}>
                <IconButton onClick={handleMenuClick}>
                    {menuOpen ? <MenuOpen className={css.buttonIcon} /> : <Menu className={css.buttonIcon} />}
                </IconButton>
            </Box>
            <Box
                component="nav"
                className={clsx(css.menu, menuOpen ? css.opened : css.closed)}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
            >
                <List>
                    {
                        components.map((component, i) => {
                            const Icon      = component.icon;
                            const current   = history.location.pathname.startsWith(component.location);

                            return (
                                <ListItem button={true} onClick={handleListClick(component.location)} key={i}>
                                    <ListItemIcon>
                                        <Icon className={clsx(css.icon, { [css.current]: current, [css.available]: !current })} />
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
                        })
                    }
                </List>
            </Box>
        </Box>
    );
};

export default Nav;

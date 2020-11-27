import React            from 'react';
import clsx             from 'clsx';
import memoize          from 'lodash/memoize';
import Menu             from '@material-ui/icons/Menu';
import MenuOpen         from '@material-ui/icons/MenuOpen';
import Home             from '@material-ui/icons/Home';
import MusicNote        from '@material-ui/icons/MusicNote';
import Orbit            from '@material-ui/icons/FilterTiltShift';
import User             from '@material-ui/icons/AccountCircle';
import ListItem         from '@material-ui/core/ListItem';
import useHistory       from '$client/context/router';
import Box              from '$client/control/Box';
import List             from '$client/control/List';
import ListItemIcon     from '$client/control/ListItemIcon';
import ListItemText     from '$client/control/ListItemText';
import { makeStyles }   from '$client/context/mui';
import IconButton       from '$client/control/IconButton';

const control = [
    { icon: Home,       primary: 'Home',                                         location: '/home' },
    { icon: MusicNote,  primary: 'Music',                                        location: '/music' },
    { icon: Menu,       primary: 'Life',                                         location: '/life' },
    { icon: Orbit,      primary: 'Space',       secondary: 'Our Solar System',   location: '/nbody' },
    { icon: Orbit,      primary: 'Chaos',                                        location: '/chaos' },
    { icon: Menu,       primary: 'button 1',    secondary: 'Aliquam lobortis',   location: '/one' },
    { icon: Menu,       primary: 'button 1',    secondary: 'Sed libero',         location: '/two' },
    { icon: User,       primary: 'authentication',                               location: '/login'},
];

const expanstionTimeout = 800;

const useStyles = makeStyles(theme => {
    const drawerClosedWidth = theme.typography.pxToRem(24 + theme.spacing(2) * 2);
    const drawerOpenedWidth = '20vw';

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
        }
    }
});


export function Nav() {
    const css                               = useStyles();
    const history                           = useHistory();
    const [ menuOpen, setMenuOpen ]         = React.useState(false);
    const timer                             = React.useRef(undefined as (number | undefined));
    const handleListClick                   = React.useCallback(
        memoize(
            (location: string) => () => {
                setMenuOpen(false);
                history.push(location);

                if(timer.current)
                    clearTimeout(timer.current);

                timer.current = window.setTimeout(() => setMenuOpen(true), expanstionTimeout * 5);
            }
        ),
        []
    )
    const handleMouseOver                   = React.useCallback(
        () => {
            if(!timer.current)
                timer.current = window.setTimeout(() => setMenuOpen(true), expanstionTimeout);
        },
        []
    )
    const handleMouseLeave                  = React.useCallback(
        () => {
            setMenuOpen(false);

            if(timer.current) {
                clearTimeout(timer.current);
                timer.current = undefined;
            }
        },
        []
    );
    const handleMenuClick                   = React.useCallback(() => setMenuOpen(false), []);

    return (
        <Box className={css.root}>
            <Box className={css.buttonBox} >
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
                        control.map((item, i) => {
                            const Icon      = item.icon;
                            const current   = history.location.pathname.startsWith(item.location);

                            return (
                                <ListItem button onClick={handleListClick(item.location)} key={i}>
                                    <ListItemIcon>
                                        <Icon className={clsx({ [css.current]: current, [css.available]: !current })} />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.primary} 
                                        secondary={item.secondary}
                                        classes={{
                                            root: css.listItemText,
                                            primary: css.primary,
                                            secondary: css.secondary
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
}

export default Nav;

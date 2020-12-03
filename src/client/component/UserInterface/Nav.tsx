import React            from 'react';
import clsx             from 'clsx';
import Menu             from '@material-ui/icons/Menu';
import MenuOpen         from '@material-ui/icons/MenuOpen';
import Home             from '@material-ui/icons/Home';
import MusicNote        from '@material-ui/icons/MusicNote';
import ViewComfy        from '@material-ui/icons/ViewComfy'
//import FilterTiltShift  from '@material-ui/icons/FilterTiltShift';
import {ImSpinner9}     from 'react-icons/im';
import BrightnessLow    from '@material-ui/icons/BrightnessLow';
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
    { icon: Home,               primary: 'Home',                                                    location: '/home' },
    { icon: MusicNote,          primary: 'Music',           secondary: 'Music collection',          location: '/music' },
    { icon: ViewComfy,          primary: 'Life',            secondary: 'Conway\'s Game of Life',    location: '/life' },
    { icon: ImSpinner9,         primary: 'Space',           secondary: 'Gravitional Simulation',    location: '/nbody' },
    { icon: BrightnessLow,      primary: 'Chaos',           secondary: 'The Mandlebrot Set',        location: '/chaos' },
    { icon: User,               primary: 'authentication',                                          location: '/login'},
];

const expanstionTimeout = 1250;

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
        }
    }
});


export const Nav: React.FC = () => {
    const css                       = useStyles();
    const history                   = useHistory();
    const [ menuOpen, setMenuOpen ] = React.useState(false);
    const [ clicked,  setClicked ]  = React.useState(false);
    const timer                     = React.useRef<number | undefined>(undefined);

    const cancelTimer = () => {
        if(timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
        }        
    }

    const handleListClick = (location: string) => () => {
        setMenuOpen(false);
        setClicked(true);
        history.push(location);
        cancelTimer();
    }

    const handleMouseOver = () => {
        cancelTimer();
        if(!clicked)
            timer.current = window.setTimeout(() => setMenuOpen(true), expanstionTimeout);
    }

    const handleMouseLeave = () => {
        setMenuOpen(false);
        setClicked(false);
        cancelTimer();
    }

    const handleMenuClick = () => setMenuOpen(m => !m);

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
                                        <Icon className={clsx(css.icon, { [css.current]: current, [css.available]: !current })} />
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

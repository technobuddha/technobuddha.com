
import React                        from 'react';
import { makeStyles }               from '$client/context/mui';
import Box                          from '$client/control/Box';
import Nav                          from './Nav';
import Header                       from './Header';
import Main                         from './Main';
import Footer                       from './Footer';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    },
    frame: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    }
})

export const UserInterface: React.FC = () => {
    const css = useStyles();

    return (
        <Box className={css.root}>
            <Nav />
            <Box className={css.frame}>
                <Header />
                <Main />
                <Footer/>            
            </Box>
        </Box>
    );
}

export default UserInterface;

import React                from 'react';
import Typography           from '@material-ui/core/Typography';
import Box                  from '@material-ui/core/Box';
import { makeStyles }       from '#context/mui';
import { useTranslation }   from '#context/i18n';
import clsx from 'clsx';
import Color from 'color';

export type HomeProps = {
    children?:  never,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: Color(theme.palette.secondary.main).fade(0.98).string()
    },
    box: {
        width: theme.spacing(60),
        margin: `${theme.spacing(4)}px auto`,
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `
            "header header"
            "left   right"`,
        backgroundColor: theme.palette.primary.main,
        border: `8px solid ${theme.palette.primary.light}`,
        borderRadius: theme.spacing(4),
        padding: theme.spacing(2),
        boxShadow: `0 0 0 ${theme.spacing(1)}px ${theme.palette.primary.dark}`
    },
    title: {
        gridArea: 'header',
        textAlign: 'center',
        marginBottom: theme.spacing(10),
        color: theme.palette.common.white,
    },
    purpose: {
        gridArea: 'left',
        textAlign: 'left',
        color: theme.palette.common.white,
    },
    author: {
        gridArea: 'right',
        textAlign: 'right',
        color: theme.palette.common.white,
    },

    "imgSection": {
        height: '144px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    "imgContainer": {
        width: '144px',
        height: '144px',
        position: 'relative',
        borderRadius: '100rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    "logoContainer": {
        width: '144px',
        height: '144px',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    "logoPoliticoForm": {
        width: '90px',
    },
    "iconsContainer": {
        animation: '$rotate 30s linear infinite',
        transformOrigin: 'center',
        width: '144px',
        height: '144px',
        borderRadius: '50%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'red',
    },

    "iconBox": {
        width: '72px',
        height: '20px',
        transformOrigin: 'bottom right',
        position: 'absolute',
        top: '52px',
    },
    "iconBox1": { transform: 'rotate(0)' },
    "iconBox2": { transform: 'rotate(30deg)' },
    "iconBox3": { transform: 'rotate(60deg)' },
    "iconBox4": { transform: 'rotate(90deg)' },
    "iconBox5": { transform: 'rotate(120deg)' },
    "iconBox6": { transform: 'rotate(150deg)' },
    "iconBox7": { transform: 'rotate(180deg)' },
    "iconBox8": { transform: 'rotate(210deg)' },
    "iconBox9": { transform: 'rotate(240deg)' },
    "iconBox10": { transform: 'rotate(270deg)' },
    "iconBox11": { transform: 'rotate(300deg)' },
    "iconBox12": { transform: 'rotate(330deg)' },

    "iconInner": {
        width: '20px',
        height: '20px',
    },

    "iconInner1": { transform: 'rotate(0)' },
    "iconInner2": { transform: 'rotate(-30deg)' },
    "iconInner3": { transform: 'rotate(-60deg)' },
    "iconInner4": { transform: 'rotate(-90deg)' },
    "iconInner5": { transform: 'rotate(-120deg)' },
    "iconInner6": { transform: 'rotate(-150deg)' },
    "iconInner7": { transform: 'rotate(-180deg)' },
    "iconInner8": { transform: 'rotate(-210deg)' },
    "iconInner9": { transform: 'rotate(-240deg)' },
    "iconInner10": { transform: 'rotate(-270deg)' },
    "iconInner11": { transform: 'rotate(-300deg)' },
    "iconInner12": { transform: 'rotate(-330deg)' },

    "icon": {
        backgroundSize: 'cover',
        width: '20px',
        height: '20px',
        animation: '$rotate 30s linear reverse infinite',
    },

    "@keyframes rotate": {
        "0%": { transform: 'rotateZ(0)' },
        "100%": { transform: 'rotateZ(360deg)' }
    }

}));

export const Home: React.FC<HomeProps> = () => {
    const css   = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={css.root}>
            <Box className={css.box}>
                <Typography variant="h4" className={css.title}>
                    technobuddha.com
                </Typography>
                <Typography variant="h5" className={css.purpose}>
                    {t('The playground of')}
                </Typography>
                <Typography variant="h5" className={css.author}>
                    Phil Hill
                </Typography>
            </Box>
            <Box className={css.imgSection}>
                <Box className={css.imgContainer}>
                    <Box className={css.logoContainer}>
                        <svg data-v-2c126d96="" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 83 16" className="logoPoliticoForm"><path d="M2.31 9.45v6.27H0V.29h2.63c1.3 0 2.27.09 2.93.27.67.18 1.25.52 1.76 1.02a4.4 4.4 0 011.33 3.28c0 1.4-.47 2.53-1.42 3.36S5 9.45 3.39 9.45H2.31zm0-2.15h.87c2.14 0 3.21-.83 3.21-2.47 0-1.6-1.1-2.4-3.3-2.4H2.3V7.3zM9.39 7.93c0-2.17.8-4.03 2.39-5.6A7.86 7.86 0 0117.49 0c2.2 0 4.09.79 5.66 2.36a7.71 7.71 0 012.37 5.67c0 2.21-.8 4.1-2.38 5.64A7.96 7.96 0 0117.37 16c-1.99 0-3.78-.69-5.36-2.07a7.58 7.58 0 01-2.62-6zm2.35.03c0 1.7.57 3.1 1.72 4.2a5.52 5.52 0 003.94 1.65c1.62 0 2.99-.56 4.1-1.68A5.67 5.67 0 0023.17 8c0-1.64-.55-3.02-1.65-4.13a5.45 5.45 0 00-4.06-1.68 5.5 5.5 0 00-4.06 1.68 5.56 5.56 0 00-1.66 4.09zM29.14.29v13.24h4.54v2.19H26.8V.29h2.33zM37.66.29v15.43h-2.33V.29h2.33zM45.18 2.48v13.24h-2.33V2.48H39.3V.28h9.42v2.2h-3.54zM52.7.29v15.43h-2.34V.29h2.33zM66.3 1.11v2.76a6.46 6.46 0 00-4.17-1.7c-1.59 0-2.92.58-4.01 1.72a5.76 5.76 0 00-1.64 4.15c0 1.62.55 2.99 1.64 4.1s2.43 1.67 4.02 1.67c.82 0 1.51-.13 2.09-.4.32-.13.65-.31 1-.54s.7-.5 1.07-.82v2.81A8.38 8.38 0 0162.1 16c-2.2 0-4.08-.77-5.64-2.3a7.65 7.65 0 01-2.33-5.63c0-1.96.65-3.71 1.95-5.25a7.76 7.76 0 016.2-2.83c1.4 0 2.73.37 4.03 1.12zM66.65 7.93c0-2.17.8-4.03 2.4-5.6A7.86 7.86 0 0174.74 0c2.2 0 4.1.79 5.66 2.36a7.71 7.71 0 012.37 5.67c0 2.21-.8 4.1-2.38 5.64A7.96 7.96 0 0174.64 16c-2 0-3.78-.69-5.37-2.07a7.58 7.58 0 01-2.62-6zm2.35.03c0 1.7.57 3.1 1.72 4.2a5.52 5.52 0 003.95 1.65c1.62 0 2.98-.56 4.1-1.68A5.67 5.67 0 0080.42 8c0-1.64-.55-3.02-1.65-4.13a5.45 5.45 0 00-4.05-1.68 5.5 5.5 0 00-4.07 1.68A5.56 5.56 0 0069 7.96z"></path></svg>
                    </Box>
                    <Box className={css.iconsContainer}>
                        <Box className={clsx(css.iconBox, css.iconBox1)}>
                            <Box className={clsx(css.iconInner, css.iconInner1)}>
                                <Box className={css.icon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>videocam-icon</title><path d="M0 0h24v24H0z" fill="none"></path><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path></svg>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox2)}>
                            <Box className={clsx(css.iconInner, css.iconInner2)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>construction-icon</title><g><rect fill="none" height="24" width="24"></rect></g><g><g><rect height="8.48" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -6.8717 17.6255)" width="3" x="16.34" y="12.87"></rect><path d="M17.5,10c1.93,0,3.5-1.57,3.5-3.5c0-0.58-0.16-1.12-0.41-1.6l-2.7,2.7L16.4,6.11l2.7-2.7C18.62,3.16,18.08,3,17.5,3 C15.57,3,14,4.57,14,6.5c0,0.41,0.08,0.8,0.21,1.16l-1.85,1.85l-1.78-1.78l0.71-0.71L9.88,5.61L12,3.49 c-1.17-1.17-3.07-1.17-4.24,0L4.22,7.03l1.41,1.41H2.81L2.1,9.15l3.54,3.54l0.71-0.71V9.15l1.41,1.41l0.71-0.71l1.78,1.78 l-7.41,7.41l2.12,2.12L16.34,9.79C16.7,9.92,17.09,10,17.5,10z"></path></g></g></svg>                                
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox3)}>
                            <Box className={clsx(css.iconInner, css.iconInner3)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>campaign-icon</title><path d="M0 0h24v24H0z" fill="none"></path><path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z"></path></svg>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox4)}>
                            <Box className={clsx(css.iconInner, css.iconInner4)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>mic-icon</title><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox5)}>
                            <Box className={clsx(css.iconInner, css.iconInner5)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>policy-icon</title><g><rect fill="none" height="24" width="24"></rect></g><g><g></g><g><path d="M21,5l-9-4L3,5v6c0,5.55,3.84,10.74,9,12c2.3-0.56,4.33-1.9,5.88-3.71l-3.12-3.12c-1.94,1.29-4.58,1.07-6.29-0.64 c-1.95-1.95-1.95-5.12,0-7.07c1.95-1.95,5.12-1.95,7.07,0c1.71,1.71,1.92,4.35,0.64,6.29l2.9,2.9C20.29,15.69,21,13.38,21,11V5z"></path><circle cx="12" cy="12" r="3"></circle></g></g></svg>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox6)}>
                            <Box className={clsx(css.iconInner, css.iconInner6)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>eco-icon</title><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M6.05,8.05c-2.73,2.73-2.73,7.15-0.02,9.88c1.47-3.4,4.09-6.24,7.36-7.93c-2.77,2.34-4.71,5.61-5.39,9.32 c2.6,1.23,5.8,0.78,7.95-1.37C19.43,14.47,20,4,20,4S9.53,4.57,6.05,8.05z"></path></g></g></svg>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox7)}>
                            <Box className={clsx(css.iconInner, css.iconInner7)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>analytics-icon</title><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2v-3h2v3zm0-5h-2v-2h2v2zm4 5h-2V7h2v10z"></path></svg>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox8)}>
                            <Box className={clsx(css.iconInner, css.iconInner8)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>biotech-icon</title><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M7,19c-1.1,0-2,0.9-2,2h14c0-1.1-0.9-2-2-2h-4v-2h3c1.1,0,2-0.9,2-2h-8c-1.66,0-3-1.34-3-3c0-1.09,0.59-2.04,1.46-2.56 C8.17,9.03,8,8.54,8,8c0-0.21,0.04-0.42,0.09-0.62C6.28,8.13,5,9.92,5,12c0,2.76,2.24,5,5,5v2H7z"></path><path d="M10.56,5.51C11.91,5.54,13,6.64,13,8c0,0.75-0.33,1.41-0.85,1.87l0.59,1.62l0.94-0.34l0.34,0.94l1.88-0.68l-0.34-0.94 l0.94-0.34L13.76,2.6l-0.94,0.34L12.48,2L10.6,2.68l0.34,0.94L10,3.97L10.56,5.51z"></path><circle cx="10.5" cy="8" r="1.5"></circle></g></g></svg>                               
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox9)}>
                            <Box className={clsx(css.iconInner, css.iconInner9)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>psychology-icon</title><g><rect fill="none" height="24" width="24"></rect></g><g><g><path d="M13,8.57c-0.79,0-1.43,0.64-1.43,1.43s0.64,1.43,1.43,1.43s1.43-0.64,1.43-1.43S13.79,8.57,13,8.57z"></path><path d="M13,3C9.25,3,6.2,5.94,6.02,9.64L4.1,12.2C3.85,12.53,4.09,13,4.5,13H6v3c0,1.1,0.9,2,2,2h1v3h7v-4.68 c2.36-1.12,4-3.53,4-6.32C20,6.13,16.87,3,13,3z M16,10c0,0.13-0.01,0.26-0.02,0.39l0.83,0.66c0.08,0.06,0.1,0.16,0.05,0.25 l-0.8,1.39c-0.05,0.09-0.16,0.12-0.24,0.09l-0.99-0.4c-0.21,0.16-0.43,0.29-0.67,0.39L14,13.83c-0.01,0.1-0.1,0.17-0.2,0.17h-1.6 c-0.1,0-0.18-0.07-0.2-0.17l-0.15-1.06c-0.25-0.1-0.47-0.23-0.68-0.39l-0.99,0.4c-0.09,0.03-0.2,0-0.25-0.09l-0.8-1.39 c-0.05-0.08-0.03-0.19,0.05-0.25l0.84-0.66C10.01,10.26,10,10.13,10,10c0-0.13,0.02-0.27,0.04-0.39L9.19,8.95 c-0.08-0.06-0.1-0.16-0.05-0.26l0.8-1.38c0.05-0.09,0.15-0.12,0.24-0.09l1,0.4c0.2-0.15,0.43-0.29,0.67-0.39l0.15-1.06 C12.02,6.07,12.1,6,12.2,6h1.6c0.1,0,0.18,0.07,0.2,0.17l0.15,1.06c0.24,0.1,0.46,0.23,0.67,0.39l1-0.4c0.09-0.03,0.2,0,0.24,0.09 l0.8,1.38c0.05,0.09,0.03,0.2-0.05,0.26l-0.85,0.66C15.99,9.73,16,9.86,16,10z"></path></g></g></svg>                               </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox10)}>
                            <Box className={clsx(css.iconInner, css.iconInner10)}>
                                <Box className={css.icon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>videocam-icon</title><path d="M0 0h24v24H0z" fill="none"></path><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path></svg>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox11)}>
                            <Box className={clsx(css.iconInner, css.iconInner11)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>live_tv-icon</title><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path></svg>                                
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox12)}>
                            <Box className={clsx(css.iconInner, css.iconInner12)}>
                                <Box className={css.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><title>timeline-icon</title><g><rect fill="none" height="24" width="24"></rect></g><g><g><g><path d="M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z"></path></g></g></g></svg>                               
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
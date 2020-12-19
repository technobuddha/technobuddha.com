import React                from 'react';
import Typography           from '@material-ui/core/Typography';
import Box                  from '@material-ui/core/Box';
import { makeStyles }       from '#context/mui';
import { useTranslation }   from '#context/i18n';
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
        </Box>
    );
}

export default Home;
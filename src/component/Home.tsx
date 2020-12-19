import React                from 'react';
import Typography           from '@material-ui/core/Typography';
import Box                  from '@material-ui/core/Box';
import { makeStyles }       from '#context/mui';
import { useTranslation }   from '#context/i18n';

export type HomeProps = {
    children?:  never,
};

const useStyles = makeStyles(theme => ({
    root: {

    },
    box: {
        width: '480px',
        margin: 'auto',
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gridTemplateRows: 'auto',
        gridTemplateAreas: `
            "header header"
            "left   right"`,
        backgroundColor: theme.palette.primary.light,
        border: `8px solid ${theme.palette.primary.dark}`,
        borderRadius: theme.spacing(4),
        padding: theme.spacing(2),
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
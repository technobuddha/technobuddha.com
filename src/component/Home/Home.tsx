import React                from 'react';
//import Typography           from '@material-ui/core/Typography';
import Box                  from '@material-ui/core/Box';
//import { useTranslation }   from '#context/i18n';
import { usePages }         from '#context/pages';

import Spinner              from './Spinner';
import css                  from './Home.pcss';

export type HomeProps = {
    children?:  never,
};

export const Home: React.FC<HomeProps> = () => {
    //const { t } = useTranslation();
    const pages = usePages();

    return (
        <Box className={css.root}>
            {/* <Box className={css.box}>
                <Typography variant="h4" className={css.title}>
                    technobuddha.com
                </Typography>
                <Typography variant="h5" className={css.purpose}>
                    {t('The playground of')}
                </Typography>
                <Typography variant="h5" className={css.author}>
                    Phil Hill
                </Typography>
            </Box> */}
            <Box className={css.article}>
            {
                pages.map((page, i) => (
                    <Box key={i} className={css.box} style={
                        { 
                            animationDelay: `${-(pages.length - i - 1)*10}s`,
                        }}>
                        {page.primary}
                    </Box>
                ))
            }
            </Box>
            <Box className={css.spinnerContainer}>
                <Spinner icons={pages.map(page => page.icon)} />
            </Box>
        </Box>
    );
}

export default Home;

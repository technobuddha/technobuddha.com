import React                from 'react';
import Typography           from '@material-ui/core/Typography';
import Box                  from '@material-ui/core/Box';
import { useTranslation }   from '#context/i18n';
import Spinner              from './Spinner';
import css from './Home.pcss';

import { GiConwayLifeGlider, GiOrbital, GiHouse, GiMusicalNotes, GiChessKnight, GiThornyTentacle } from 'react-icons/gi';

export type HomeProps = {
    children?:  never,
};

export const Home: React.FC<HomeProps> = () => {
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
            <Box className={css.spinnerContainer}>
                <Spinner icons={[GiHouse, GiMusicalNotes, GiConwayLifeGlider, GiOrbital, GiThornyTentacle, GiChessKnight]} />
            </Box>
        </Box>
    );
}

export default Home;

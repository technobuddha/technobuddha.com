import React                from 'react';
import Typography           from '@material-ui/core/Typography';
import Box                  from '@material-ui/core/Box';
import { useTranslation }   from '#context/i18n';
import clsx from 'clsx';
import css from './Home.pcss';

import { GiConwayLifeGlider, GiOrbital, GiMaterialsScience, GiHouse, GiMusicalNotes, GiChessKnight, GiThornyTentacle, GiBarbedSun, GiBlackHoleBolas, GiBowlSpiral, GiButterfly, GiCirclingFish } from 'react-icons/gi';

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
                <Box className={css.spinner}>
                    <Box className={css.pie}>
                        <Box className={css.segment}></Box>
                    </Box>
                    <Box className={css.iconContainer}>
                        <Box className={clsx(css.iconBox, css.iconBox1)}>
                            <Box className={clsx(css.iconInner, css.iconInner1)}>
                                <Box className={css.icon}>
                                    <GiHouse />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox2)}>
                            <Box className={clsx(css.iconInner, css.iconInner2)}>
                                <Box className={css.icon}>
                                    <GiMusicalNotes />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox3)}>
                            <Box className={clsx(css.iconInner, css.iconInner3)}>
                                <Box className={css.icon}>
                                    <GiConwayLifeGlider />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox4)}>
                            <Box className={clsx(css.iconInner, css.iconInner4)}>
                                <Box className={css.icon}>
                                    <GiOrbital />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox5)}>
                            <Box className={clsx(css.iconInner, css.iconInner5)}>
                                <Box className={css.icon}>
                                    <GiThornyTentacle />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox6)}>
                            <Box className={clsx(css.iconInner, css.iconInner6)}>
                                <Box className={css.icon}>
                                    <GiChessKnight />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox7)}>
                            <Box className={clsx(css.iconInner, css.iconInner7)}>
                                <Box className={css.icon}>
                                    <GiMaterialsScience />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox8)}>
                            <Box className={clsx(css.iconInner, css.iconInner8)}>
                                <Box className={css.icon}>
                                    <GiCirclingFish/>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox9)}>
                            <Box className={clsx(css.iconInner, css.iconInner9)}>
                                <Box className={css.icon}>
                                    <GiBowlSpiral />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox10)}>
                            <Box className={clsx(css.iconInner, css.iconInner10)}>
                                <Box className={css.icon}>
                                    <GiBarbedSun />
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox11)}>
                            <Box className={clsx(css.iconInner, css.iconInner11)}>
                                <Box className={css.icon}>
                                    <GiBlackHoleBolas/>
                                </Box>
                            </Box>
                        </Box>
                        <Box className={clsx(css.iconBox, css.iconBox12)}>
                            <Box className={clsx(css.iconInner, css.iconInner12)}>
                                <Box className={css.icon}>
                                    <GiButterfly/>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

/*

GiZigzagTune GiYinYang GiWoodCabin GiVortex GiVineFlower GiTwinShell GiTriplePlier GiThornyTentacle GiSwirlRing GiSwirlString GiLunarModule GiFluffyFlame 
 
*/

export default Home;
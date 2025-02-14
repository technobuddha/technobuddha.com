import React              from 'react';
import memoize            from 'lodash/memoize';
import Box                from '@material-ui/core/Box';
import { useTranslation } from '#context/i18n';
import useComponents      from '#context/component';
import Spinner            from './Spinner';
import css                from './Home.css';

export type HomeProps = {
    children?:  never;
};

const FADE = `fade${(Math.random() * 0xFFFFFFFF >>> 0).toString(16)}`;

export const Home: React.FC<HomeProps> = () => {
    const { t } = useTranslation();
    const components = useComponents();
    const speed = 15;

    const keyframes = React.useMemo(
        () => {
            const duration = speed * components.length;
            const oneSecond = 100.0 / duration;

            return `
                @keyframes ${FADE} {
                    0%                                       { opacity: 0; max-height: 0;    }
                    ${((duration - speed) + 0) * oneSecond}% { opacity: 0; max-height: 0;    }
                    ${((duration - speed) + 1) * oneSecond}% { opacity: 1; max-height: 100%; }
                    ${(duration - 1)           * oneSecond}% { opacity: 1; max-height: 100%; }
                    100%                                     { opacity: 0; max-height: 0;    }
                }
            `;
        },
        [ speed, components ]
    );

    const articleStyle = React.useMemo(
        () => {
            return memoize<(i: number) => React.CSSProperties>(i => ({
                animationName: FADE,
                animationDuration: `${components.length * speed}s`,
                animationDelay: `${-(components.length - i - 1) * speed}s`,
            }));
        },
        [ speed ]
    );

    return (
        <Box className={css.root}>
            <style type="text/css">{keyframes}</style>
            <Box className={css.spinnerContainer}>
                <Spinner speed={speed} icons={components.map(component => component.icon)} />
            </Box>
            {
                components.map((component, i) => {
                    return (
                        <div key={i} className={css.box} style={articleStyle(i)}>
                            <div className={css.primary}>{component.primary}</div>
                            {
                                component.secondary &&
                                <div className={css.secondary}>{component.secondary}</div>
                            }
                            {
                                component.description &&
                                <div className={css.description}>{component.description}</div>
                            }
                            {
                                component.todo &&
                                <div className={css.todo}>
                                    {t('To Do')}
                                    <ul>
                                        {component.todo.map((td, j) => (<li key={j}>{td}</li>))}
                                    </ul>
                                </div>
                            }
                        </div>
                    );
                })
            }
        </Box>
    );
};

export default Home;

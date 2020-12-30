import React              from 'react';
import memoize            from 'lodash/memoize';
import Box                from '@material-ui/core/Box';
import { useTranslation } from '#context/i18n';
import { usePages }       from '#context/pages';
import Spinner            from './Spinner';
import css                from './Home.pcss';

export type HomeProps = {
    children?:  never,
};

export const Home: React.FC<HomeProps> = () => {
    const { t } = useTranslation();
    const pages = usePages();
    const speed = 15;

    const keyframes = React.useMemo(() => {
            const duration = speed * pages.length;
            const oneSecond = 100.0 / duration;

            return `
                @keyframes fade {
                0%                                       { opacity: 0; max-height: 0;    }
                ${((duration - speed) + 0) * oneSecond}% { opacity: 0; max-height: 0;    }
                ${((duration - speed) + 1) * oneSecond}% { opacity: 1; max-height: 100%; }
                ${(duration - 1)           * oneSecond}% { opacity: 1; max-height: 100%; }
                100%                                     { opacity: 0; max-height: 0;    }
                }
            `;
        },
        [speed, pages]
    )

    const articleStyle = React.useMemo(() =>
        memoize<(i: number) => React.CSSProperties>(i => ({
            animationName: 'fade',
            animationDuration: `${pages.length * speed}s`,
            animationDelay: `${-(pages.length - i - 1) * speed}s`,
        })),
        [speed]
    );

    return (
        <Box className={css.root}>
            <style type="text/css">{keyframes}</style>
            <Box className={css.spinnerContainer}>
                <Spinner speed={speed} icons={pages.map(page => page.icon)} />
            </Box>
            {
                pages.map((page, i) => {
                    return (
                        <div key={i} className={css.box} style={articleStyle(i)}>
                            <div className={css.primary}>{page.primary}</div>
                            <div className={css.secondary}>{page.secondary}</div>
                            <div className={css.description}>{page.description}</div>
                            {
                                page.todo &&
                                <div className={css.todo}>
                                    {t('To Do')}
                                    <ul>
                                        {page.todo.map((td, i) => (<li key={i}>{td}</li>))}
                                    </ul>
                                </div>
                            }
                        </div>
                    );
                })
            }
        </Box>
    );
}

export default Home;

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
                pages.map((page, i) => (
                    <div key={i} className={css.box} style={articleStyle(i)}>
                        <div className={css.primary}>{page.primary}</div>
                        <div className={css.secondary}>{page.secondary}</div>
                        <div className={css.description}>
                            Quisque velit nisi, pretium ut lacinia in, elementum id enim. Curabitur aliquet quam id dui posuere blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Nulla quis lorem ut libero malesuada feugiat. Donec sollicitudin molestie malesuada. Donec rutrum congue leo eget malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </div>
                        <div className={css.description}>
                            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Donec rutrum congue leo eget malesuada. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.
                        </div>
                        {/* <div className={css.description}>
                            Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Nulla porttitor accumsan tincidunt. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Cras ultricies ligula sed magna dictum porta. Nulla quis lorem ut libero malesuada feugiat. Proin eget tortor risus. Donec sollicitudin molestie malesuada. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus. Donec rutrum congue leo eget malesuada.
                        </div> */}
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
                ))
            }
        </Box>
    );
}

export default Home;

import React from 'react';
import memoize from 'lodash/memoize';

import { useComponents } from '#context/component';
import { useTranslation } from '#context/i18n';

import { Spinner } from './spinner.jsx';

import css from './home.module.css';

export type HomeProps = {
  children?: never;
};

// eslint-disable-next-line no-bitwise
const FADE = `fade${((Math.random() * 0xffffffff) >>> 0).toString(16)}`;

export const Home: React.FC<HomeProps> = () => {
  const { t } = useTranslation();
  const components = useComponents();
  const speed = 15;

  const keyframes = React.useMemo(() => {
    const duration = speed * components.length;
    const oneSecond = 100.0 / duration;

    return `
      @keyframes ${FADE} {
        0%                                     { opacity: 0; max-height: 0;    }
        ${(duration - speed + 0) * oneSecond}% { opacity: 0; max-height: 0;    }
        ${(duration - speed + 1) * oneSecond}% { opacity: 1; max-height: 100%; }
        ${(duration - 1) * oneSecond}%         { opacity: 1; max-height: 100%; }
        100%                                   { opacity: 0; max-height: 0;    }
      }
    `;
  }, [speed, components]);

  const articleStyle = React.useMemo(
    () =>
      memoize<(i: number) => React.CSSProperties>((i) => ({
        animationName: FADE,
        animationDuration: `${components.length * speed}s`,
        animationDelay: `${-(components.length - i - 1) * speed}s`,
      })),
    [speed, components.length],
  );

  return (
    <div className={css.root}>
      <style type="text/css">{keyframes}</style>
      <div className={css.spinnerContainer}>
        <Spinner speed={speed} icons={components.map((component) => component.icon)} />
      </div>
      {components.map((component, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className={css.box} style={articleStyle(i)}>
          <div className={css.primary}>{component.primary}</div>
          {Boolean(component.secondary) && (
            <div className={css.secondary}>{component.secondary}</div>
          )}
          {Boolean(component.description) && (
            <div className={css.description}>{component.description}</div>
          )}
          {Boolean(component.todo) && (
            <div className={css.todo}>
              {t('To Do')}
              <ul>
                {(component.todo ?? []).map((td, j) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={j}>{td}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

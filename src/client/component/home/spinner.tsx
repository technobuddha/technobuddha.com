import React from 'react';
import memoize from 'lodash/memoize';
import { type IconType } from 'react-icons';

import css from './spinner.module.css';

// eslint-disable-next-line no-bitwise
const FADE = `fade${((Math.random() * 0xffffffff) >>> 0).toString(16)}`;

export type SpinnerComponent = {
  name: string;
  icon: IconType;
  primary?: string;
  secondary?: string;
  description?: React.ReactNode;
  todo?: string[];
};

export type SpinnerProps = {
  readonly components: SpinnerComponent[];
  readonly speed?: number;
  readonly children?: never;
};

export const Spinner: React.FC<SpinnerProps> = ({ components, speed = 15 }) => {
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

  const angle = React.useMemo(() => 360 / components.length, [components]);

  const segmentStyle1 = React.useMemo(
    (): React.CSSProperties => ({ transform: `translate(0, -50%) rotate(${270 - angle / 2}deg)` }),
    [angle],
  );
  const segmentStyle2 = React.useMemo(
    (): React.CSSProperties => ({ transform: `translate(0, -50%) rotate(${90 + angle / 2}deg)` }),
    [angle],
  );
  const containerStyle = React.useMemo(
    (): React.CSSProperties => ({ animationDuration: `${components.length * speed}s` }),
    [components, speed],
  );
  const iconBoxStyle = React.useMemo(
    () =>
      memoize(
        (i: number): React.CSSProperties => ({
          transform: `rotate(${-(270 + (i + 0.5) * angle)}deg)`,
        }),
      ),
    [angle],
  );
  const iconInnerStyle = React.useMemo(
    () =>
      memoize(
        (i: number): React.CSSProperties => ({
          transform: `rotate(${270 + (i + 0.5) * angle}deg)`,
        }),
      ),
    [angle],
  );
  const iconStyle = React.useMemo<React.CSSProperties>(
    () => ({ animationDuration: `${components.length * speed}s` }),
    [components, speed],
  );

  return (
    <div className={css.spinner}>
      <style type="text/css">{keyframes}</style>
      <div className={css.wheel}>
        <div className={css.pie}>
          <div className={css.segment} style={segmentStyle1} />
          <div className={css.segment} style={segmentStyle2} />
        </div>
        <div className={css.iconContainer} style={containerStyle}>
          {components.map(({ icon, name }, i) => {
            const Icon = icon;

            return (
              <div key={name} className={css.iconBox} style={iconBoxStyle(i)}>
                <div className={css.iconInner} style={iconInnerStyle(i)}>
                  <div className={css.icon} style={iconStyle}>
                    <Icon />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={css.descriptions}>
        {components.map(({ name, primary, secondary, description }, i) => (
          <div key={name} className={css.box} style={articleStyle(i)}>
            <div className={css.primary}>{primary}</div>
            {Boolean(secondary) && <div className={css.secondary}>{secondary}</div>}
            {Boolean(description) && <div className={css.description}>{description}</div>}
            {/*Boolean(component.todo) && (
            <div className={css.todo}>
              {t('To Do')}
              <ul>
                {(component.todo ?? []).map((td, j) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={j}>{td}</li>
                ))}
              </ul>
            </div>
          )*/}
          </div>
        ))}
      </div>
    </div>
  );
};

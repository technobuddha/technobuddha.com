import React from 'react';
import { memoize } from '@technobuddha/library';
import { type IconType } from 'react-icons';

import css from './spinner.module.css';

export type SpinnerComponent = {
  name: string;
  icon: IconType;
};

export type SpinnerProps<T extends SpinnerComponent> = {
  readonly size?: string;
  readonly borderSize?: string;
  readonly iconSize?: string;
  readonly components: T[];
  readonly speed?: number;
  onClick?(this: void, component: T): void;
  children(this: void, props: T): React.ReactNode;
};

export function Spinner<T extends SpinnerComponent>({
  size = '15rem',
  borderSize = '6px',
  iconSize = '20px',
  components,
  speed = 12,
  onClick,
  children,
}: SpinnerProps<T>): React.ReactNode {
  const animationId = React.useMemo(
    () => `spinner${Math.floor(Math.random() * 0xffffffff).toString(16)}`,
    [],
  );
  const keyframes = React.useMemo(() => {
    const duration = speed * components.length;
    const oneSecond = 100.0 / duration;

    return `
      @keyframes ${animationId} {
        0%                                     { opacity: 0; z-index: -1; }
        ${(duration - speed + 0) * oneSecond}% { opacity: 0; z-index: -1; }
        ${(duration - speed + 1) * oneSecond}% { opacity: 1; z-index: +1; }
        ${(duration - 1) * oneSecond}%         { opacity: 1; z-index: +1; }
        100%                                   { opacity: 0; z-index: -1; }
      }
    `;
  }, [speed, components, animationId]);

  const articleStyle = React.useMemo(
    () =>
      memoize(
        (i: number) =>
          ({
            animationName: animationId,
            animationDuration: `${components.length * speed}s`,
            animationDelay: `${-(components.length - i - 1) * speed}s`,
          }) as React.CSSProperties,
      ),
    [speed, components.length, animationId],
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

  const handleOnClick = React.useCallback(() => {
    const visibleElement = Array.from(
      document.querySelectorAll(`.${css.descriptions} > .${css.box}`),
    ).find((el) => Number.parseInt(getComputedStyle(el).zIndex) >= 0);

    if (visibleElement) {
      const name = visibleElement.getAttribute('data-name');
      const component = components.find((c) => c.name === name);

      if (component) {
        onClick?.(component);
      }
    }
  }, [components, onClick]);

  return (
    <div
      className={css.spinner}
      style={{ '--size': size, '--border': borderSize, '--icon': iconSize } as React.CSSProperties}
    >
      <style type="text/css">{keyframes}</style>
      <button className={css.wheel} type="button" onClick={handleOnClick}>
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
                    <Icon size={iconSize} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </button>
      <div className={css.descriptions}>
        {components.map((component, i) => (
          <div
            key={component.name}
            className={css.box}
            style={articleStyle(i)}
            data-name={component.name}
          >
            {children(component)}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import memoize from 'lodash/memoize';
import css from './spinner.module.css';
import type { IconType } from 'react-icons';

export type SpinnerProps = {
  icons: IconType[];
  speed?: number;
  children?: never;
};

export const Spinner: React.FC<SpinnerProps> = ({ icons, speed = 10 }) => {
  const angle = 360 / icons.length;

  const segmentStyle1 = React.useMemo(
    (): React.CSSProperties => ({ transform: `translate(0, -50%) rotate(${270 - angle / 2}deg)` }),
    [angle],
  );
  const segmentStyle2 = React.useMemo(
    (): React.CSSProperties => ({ transform: `translate(0, -50%) rotate(${90 + angle / 2}deg)` }),
    [angle],
  );
  const containerStyle = React.useMemo(
    (): React.CSSProperties => ({ animationDuration: `${icons.length * speed}s` }),
    [icons, speed],
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
    () => ({ animationDuration: `${icons.length * speed}s` }),
    [icons, speed],
  );

  return (
    <div className={css.root}>
      <div className={css.spinner}>
        <div className={css.pie}>
          <div className={css.segment} style={segmentStyle1} />
          <div className={css.segment} style={segmentStyle2} />
        </div>
        <div className={css.iconContainer} style={containerStyle}>
          {icons.map((Icon, i) => (
            <div key={i} className={css.iconBox} style={iconBoxStyle(i)}>
              <div className={css.iconInner} style={iconInnerStyle(i)}>
                <div className={css.icon} style={iconStyle}>
                  <Icon />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

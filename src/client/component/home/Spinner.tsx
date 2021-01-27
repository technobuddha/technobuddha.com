import React    from 'react';
import memoize  from 'lodash/memoize';
import Box      from '@material-ui/core/Box';
import css      from './Spinner.module.css';
import type { IconType } from '%icons';

export type SpinnerProps = {
    icons: IconType[];
    speed?: number;
    children?:  never;
};

export const Spinner: React.FC<SpinnerProps> = ({ icons, speed = 10 }) => {
    const angle = 360 / icons.length;

    const segmentStyle1     = React.useMemo(
        (): React.CSSProperties => ({ transform: `translate(0, -50%) rotate(${270 - angle / 2}deg)` }),
        [angle]
    );
    const segmentStyle2     = React.useMemo(
        (): React.CSSProperties => ({ transform: `translate(0, -50%) rotate(${ 90 + angle / 2}deg)` }),
        [angle]
    );
    const containerStyle    = React.useMemo(
        (): React.CSSProperties => ({ animationDuration: `${icons.length * speed}s` }),
        [icons, speed]
    );
    const iconBoxStyle      = React.useMemo(
        () => memoize((i: number): React.CSSProperties => ({ transform: `rotate(${-(270 + (i + 0.5) * angle)}deg)` })),
        [angle]
    );
    const iconInnerStyle    = React.useMemo(
        () => memoize((i: number): React.CSSProperties => ({ transform: `rotate(${+(270 + (i + 0.5) * angle)}deg)` })),
        [angle]
    );
    const iconStyle         = React.useMemo<React.CSSProperties>(
        () => ({ animationDuration: `${icons.length * speed}s` }),
        [icons, speed]
    );

    return (
        <Box className={css.root}>
            <Box className={css.spinner}>
                <Box className={css.pie}>
                    <Box className={css.segment} style={segmentStyle1}></Box>
                    <Box className={css.segment} style={segmentStyle2}></Box>
                </Box>
                <Box className={css.iconContainer} style={containerStyle}>
                    {
                        icons.map((Icon, i) => (
                            <Box key={i} className={css.iconBox} style={iconBoxStyle(i)}>
                                <Box className={css.iconInner} style={iconInnerStyle(i)}>
                                    <Box className={css.icon} style={iconStyle}>
                                        <Icon />
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default Spinner;

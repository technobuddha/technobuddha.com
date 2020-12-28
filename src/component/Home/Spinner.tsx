import React    from 'react';
import Box      from '@material-ui/core/Box';
import css      from './Spinner.pcss';
import type { IconType } from 'react-icons';

export type SpinnerProps = {
    icons: IconType[],
    speed?: number,
    children?:  never,
};

export const Spinner: React.FC<SpinnerProps> = ({icons, speed = 10}:SpinnerProps) => {
    const angle = 360 / icons.length;
    console.log({angle, len: icons.length})

    return (
        <Box className={css.root}>
            <Box className={css.spinner}>
                <Box className={css.pie}>
                    <Box className={css.segment} style={{transform: `translate(0, -50%) rotate(${270 - angle/2}deg)`}}></Box>
                    <Box className={css.segment} style={{transform: `translate(0, -50%) rotate(${ 90 + angle/2}deg)`}}></Box>
                </Box>
                <Box className={css.iconContainer} style={{ animationDuration: `${icons.length * speed}s`}}>
                    {
                        icons.map((Icon, i) => (
                            <Box key={i} className={css.iconBox} style={{ transform: `rotate(${-(270 + (i+0.5)*angle)}deg)` }}>
                                <Box className={css.iconInner} style={{ transform: `rotate(${+(270 + (i+0.5)*angle)}deg)` }}>
                                    <Box className={css.icon} style={{ animationDuration: `${icons.length * speed}s`}}>
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
}

export default Spinner;
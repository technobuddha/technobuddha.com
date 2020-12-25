import React                from 'react';
import Box                  from '@material-ui/core/Box';
import css from './Spinner.pcss';

import type { IconType } from 'react-icons';

export type SpinnerProps = {
    icons: IconType[],
    children?:  never,
};

export const Spinner: React.FC<SpinnerProps> = ({icons}:SpinnerProps) => {
    const angle = 360 / icons.length;
    console.log({icons, l: icons.length, angle})

    return (
        <Box className={css.root}>
            <Box className={css.spinner}>
                <Box className={css.pie}>
                    <Box className={css.segment}></Box>
                </Box>
                <Box className={css.iconContainer}>
                    {
                        icons.map((Icon, i) => (
                            <Box key={i} className={css.iconBox} style={{transform: `rotate(${i*angle}deg)`}}>
                        <       Box className={css.iconInner} style={{transform: `rotate(${-i*angle}deg)`}}>
                                    <Box className={css.icon}>
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
import React          from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box            from '@material-ui/core/Box';
import Button         from '@material-ui/core/Button';
import clsx           from 'clsx';

import type { FilterActuatorClasses, FilterActuatorStyles }  from '../filter';

export type FilterActuatorProps = {
    classes?:           FilterActuatorClasses;
    styles?:            FilterActuatorStyles;
    onButtonClick?:     () => void;
    Icon?:              React.ComponentType<{className?: string; style?: React.CSSProperties}>;
    title:              string;
};

const useFilterActuatorStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0.5),
        '&:not(:first-child)': {
            marginLeft: theme.spacing(0.25),
        },
    },
    button: {
        border: `solid 1px ${theme.palette.grey[900]}`,
        borderRadius: '10px',
        backgroundColor: theme.palette.grey[500],
    },
    icon: {
        color: theme.palette.grey[200],
    },
    title: {
        color: theme.palette.grey[200],
        marginRight: theme.spacing(0.5),
        marginLeft: theme.spacing(1),
    },
}));

export const FilterActuator = ({ classes, styles, Icon, onButtonClick, title }: FilterActuatorProps) => {
    const css = useFilterActuatorStyles();

    const handleButtonClick = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { onButtonClick?.(); };

    return (
        <Box
            className={clsx(css.root, classes?.root)}
            style={styles?.root}
        >
            <Button
                className={clsx(css.button, classes?.button)}
                style={styles?.button}
                onClick={handleButtonClick}
            >
                {Icon &&
                    <Icon
                        className={clsx(css.icon, classes?.icon)}
                        style={styles?.icon}
                    />
                }
                <Box
                    className={clsx(css.title, classes?.title)}
                    style={styles?.title}
                >
                    {title}
                </Box>
            </Button>
        </Box>
    );
};

export default FilterActuator;

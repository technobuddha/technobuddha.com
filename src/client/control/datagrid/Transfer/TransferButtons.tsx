import React            from 'react';
import Box              from '@material-ui/core/Box';
import Button           from '@material-ui/core/Button';
import Divider          from '@material-ui/core/Divider';
import { makeStyles }   from '@material-ui/core/styles';
import clsx             from 'clsx';
import isUndefined      from 'lodash/isUndefined';
  
type TransferButtonsProps = {
    classes?:       TransferButtonClasses,
    styles?:        TransferButtonStyles,
    dispatch:       React.MutableRefObject<DispatchFunction>;
    onRAllClick?:   () => void;
    onRSelClick?:   () => void;
    onLSelClick?:   () => void;
    onLAllClick?:   () => void;
    children?:      never;
}

export type TransferButtonClasses = {
    root:       string;
    button:     string;
    divider:    string;
}
export type TransferButtonStyles = {[key in keyof TransferButtonClasses]: React.CSSProperties};

export type DispatchFunction = (args: {rAll?: boolean, rSel?: boolean, lAll?: boolean, lSel?: boolean}) => void;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1),
        height: '100%',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
    divider: {
        margin: theme.spacing(3, 0),
        width: '100%',
    }
}));

const TransferButtons = ({classes, styles, dispatch, onRAllClick, onRSelClick, onLSelClick, onLAllClick}: TransferButtonsProps) => {
    const css                               = useStyles();
    const [rAllDisabled, setRAllDisabled]   = React.useState(true);
    const [rSelDisabled, setRSelDisabled]   = React.useState(true);
    const [lAllDisabled, setLAllDisabled]   = React.useState(true);
    const [lSelDisabled, setLSelDisabled]   = React.useState(true);
    const handleRAllClick                   = React.useCallback(() => onRAllClick?.(), [onRAllClick]);
    const handleRSelClick                   = React.useCallback(() => onRSelClick?.(), [onRSelClick]);
    const handleLSelClick                   = React.useCallback(() => onLSelClick?.(), [onLSelClick]);
    const handleLAllClick                   = React.useCallback(() => onLAllClick?.(), [onLAllClick]);

    dispatch.current = ({rAll, rSel, lAll, lSel}: Parameters<DispatchFunction>[0]) => {
        if(!isUndefined(rAll)) setRAllDisabled(rAll);
        if(!isUndefined(rSel)) setRSelDisabled(rSel);
        if(!isUndefined(lSel)) setLSelDisabled(lSel);
        if(!isUndefined(lAll)) setLAllDisabled(lAll);
    }

    return (
        <Box
            className={clsx(css.root, classes?.root)}
            style={styles?.root}
        >
            <Button
                className={clsx(css.button, classes?.button)}
                style={styles?.button}
                disabled={rAllDisabled}
                variant="outlined"
                size="small"
                onClick={handleRAllClick}
                aria-label="move all right"
            >
                ≫
            </Button>
            <Button
                className={clsx(css.button, classes?.button)}
                style={styles?.button}
                disabled={rSelDisabled}
                variant="outlined"
                size="small"
                onClick={handleRSelClick}
                aria-label="move selected right"
            >
                &gt;
            </Button>
            <Divider 
                className={clsx(css.divider, classes?.divider)}
                style={styles?.divider}
            />
            <Button
                className={clsx(css.button, classes?.button)}
                style={styles?.button}
                disabled={lSelDisabled}
                variant="outlined"
                size="small"
                onClick={handleLSelClick}
                aria-label="move selected left"
            >
                &lt;
            </Button>
            <Button
                className={clsx(css.button, classes?.button)}
                style={styles?.button}
                disabled={lAllDisabled}
                variant="outlined"
                size="small"
                onClick={handleLAllClick}
                aria-label="move all left"
            >
                ≪
            </Button>
        </Box>
    )
}

export default TransferButtons;

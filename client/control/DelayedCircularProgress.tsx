import React            from 'react';
import { makeStyles }   from '@material-ui/core/styles';
import Fade             from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      margin: theme.spacing(2),
    },
    placeholder: {
      height: 40,
    },
  }));
  
  export default function DelayedCircularProgress() {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <div className={classes.placeholder}>
          <Fade
            in={true}
            style={{transitionDelay: '800ms'}}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        </div>
      </div>
    );
  }

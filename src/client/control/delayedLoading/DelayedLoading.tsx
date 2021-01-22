import React            from 'react';
import Fade             from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import css              from './DelayedLoading.module.pcss';
  
export const DelayedLoading: React.FC = () => {
  
    return (
        <div className={css.delayedLoading}>
            <div className={css.placeholder}>
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

export default DelayedLoading;

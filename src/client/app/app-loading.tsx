import React from 'react';
import { CircularProgress } from '#control/circular-progress';
import css from './app-loading.module.css';

type AppLoadingProps = {
  children?: never;
};

export const AppLoading: React.FC<AppLoadingProps> = () => {
  return (
    <div className={css.appLoading}>
      <CircularProgress />
    </div>
  );
};

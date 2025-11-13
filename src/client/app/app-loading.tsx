import React from 'react';

import { CircularProgress } from '#control';

import css from './app-loading.module.css' with { type: 'css' };

type AppLoadingProps = {
  children?: never;
};

export const AppLoading: React.FC<AppLoadingProps> = () => (
  <div className={css.appLoading}>
    <CircularProgress />
  </div>
);

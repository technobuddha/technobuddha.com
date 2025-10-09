import React from 'react';

import css from './wait.module.css' with { type: 'css' };

export type WaitProps = {
  children?: never;
};

export const Wait: React.FC<WaitProps> = () => <div className={css.root} />;

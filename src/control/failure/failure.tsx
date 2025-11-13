import React from 'react';
import clsx from 'clsx';

import css from './failure.module.css' with { type: 'css' };

export type FailureProps = {
  readonly message?: string;
  readonly description?: string;
  readonly animated?: boolean;
  readonly children?: never;
};

export const Failure: React.FC<FailureProps> = ({ message, description, animated = true }) => (
  <>
    <div className={clsx(css.icon, animated && css.animated)} />
    {Boolean(message) && <div className={css.message}>{message}</div>}
    {Boolean(message) && <div className={css.description}>{description}</div>}
  </>
);

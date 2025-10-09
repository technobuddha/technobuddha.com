import React from 'react';
import clsx from 'clsx';

import { Link } from '../link/index.ts';

import css from './not-found.module.css' with { type: 'css' };

export type NotFoundProps = {
  readonly animated?: boolean;
  readonly message?: string;
  readonly children?: never;
};

export const NotFound: React.FC<NotFoundProps> = ({
  animated = false,
  message = 'The requested page can not be found.',
}) => (
  <>
    <div className={clsx(css.icon, animated && css.animated)} />
    <div className={css.message}>{message}</div>
    <div className={css.status}>
      Return to <Link to="/home">Home</Link>
    </div>
  </>
);

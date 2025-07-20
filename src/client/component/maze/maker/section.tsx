import React from 'react';
import { Card, CardContent } from '@mui/material';
import clsx from 'clsx';

import { Typography } from '#control';

import css from './section.module.css';

type SectionProps = {
  readonly className?: string;
  readonly title: string;
  readonly children: React.ReactNode;
};
export const Section: React.FC<SectionProps> = ({ className, title, children }) => (
  <Card className={clsx(css.section, className)} variant="outlined">
    <CardContent className={css.content}>
      <Typography className={css.header}>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);

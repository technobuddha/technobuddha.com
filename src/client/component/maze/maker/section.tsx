import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import css from './section.module.css';

type SectionProps = {
  readonly title: string;
  readonly children: React.ReactNode;
};
export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <Card className={css.section} variant="outlined">
    <CardContent className={css.content}>
      <Typography className={css.header}>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);

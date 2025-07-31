import React from 'react';
import clsx from 'clsx';

import { Box, Card, CardContent, Help, Typography } from '#control';

import css from './section.module.css';

type SectionProps = {
  readonly className?: string;
  readonly title: string;
  readonly info?: React.ReactNode;
  readonly children: React.ReactNode;
};
export const Section: React.FC<SectionProps> = ({ className, title, info, children }) => (
  <Card className={clsx(css.section, className)} variant="outlined">
    <CardContent className={css.content}>
      <Box className={css.header}>
        {Boolean(info) && <Help className={css.help}>{info}</Help>}
        <Typography className={css.title}>{title}</Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

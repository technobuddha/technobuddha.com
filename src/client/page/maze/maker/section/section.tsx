import React from 'react';
import clsx from 'clsx';
import { HiMiniInformationCircle } from 'react-icons/hi2';

import { Box, Card, CardContent, Tooltip, Typography } from '#control';

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
        {Boolean(info) && (
          <Tooltip title={info}>
            <div className={css.info}>
              <HiMiniInformationCircle />
            </div>
          </Tooltip>
        )}
        <Typography className={css.title}>{title}</Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

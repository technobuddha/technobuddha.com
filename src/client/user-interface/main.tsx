import React from 'react';
import Box from '@mui/material/Box';
import clsx from 'clsx';

import { useComponents } from '#context/component';
import { Route, Routes } from '#context/router';

import css from './main.module.css';

type MainProps = {
  readonly className?: string;
  readonly children?: never;
};

export const Main: React.FC<MainProps> = ({ className }) => {
  const components = useComponents();

  return (
    <Box className={clsx(className, css.main)}>
      <Routes>
        {components.map((component, i) => {
          const Component = component.component;
          // eslint-disable-next-line react/no-array-index-key
          return <Route key={i} path={component.location} Component={Component} />;
        })}
        <Route path="*" element={<div>Catch-all route</div>} />
      </Routes>
    </Box>
  );
};

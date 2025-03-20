import React from 'react';
import Box from '@mui/material/Box';
import { Route, Routes } from '#context/router';
import { useComponents } from '#context/component';
import css from './main.module.css';
import clsx from 'clsx';

type MainProps = {
  className?: string;
  children?: never;
};

export const Main: React.FC<MainProps> = ({ className }) => {
  const components = useComponents();

  return (
    <Box className={clsx(className, css.main)}>
      <Routes>
        {components.map((component, i) => {
          const Component = component.component;
          return <Route key={i} path={component.location} Component={Component} />;
        })}
        <Route path="*" element={<div>Catch-all route</div>} />
      </Routes>
    </Box>
  );
};

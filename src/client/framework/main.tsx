import React from 'react';
import clsx from 'clsx';

import { useTranslation } from '#context/i18n';
import { Route, Routes } from '#context/router';
import { Box } from '#control';
import { components } from '#settings/components.jsx';

import css from './main.module.css';

type MainProps = {
  readonly className?: string;
  readonly children?: never;
};

export const Main: React.FC<MainProps> = ({ className }) => {
  const { t } = useTranslation();
  const translatedComponents = React.useMemo(() => components(t), [t]);

  return (
    <Box className={clsx(className, css.main)}>
      <Routes>
        {translatedComponents?.map(({ component, location, route, name }) => {
          const Component = component;
          return <Route key={name} path={route ?? location} Component={Component} />;
        })}
        <Route path="*" element={<div>Catch-all route</div>} />
      </Routes>
    </Box>
  );
};

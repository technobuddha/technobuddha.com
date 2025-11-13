import React from 'react';
import clsx from 'clsx';

import { useTranslation } from '#context/i18n';
import { Route, Routes } from '#context/router';
import { Box } from '#control';
import { pages } from '#settings/pages.jsx';

import css from './main.module.css' with { type: 'css' };

type MainProps = {
  readonly className?: string;
  readonly children?: never;
};

export const Main: React.FC<MainProps> = ({ className }) => {
  const { t } = useTranslation();
  const translatedPages = React.useMemo(() => pages(t), [t]);

  return (
    <Box className={clsx(className, css.main)}>
      <Routes>
        {translatedPages?.map(({ component, location, route, name }) => {
          const Component = component;
          return <Route key={name} path={route ?? location} Component={Component} />;
        })}
        <Route path="*" element={<div>Catch-all route</div>} />
      </Routes>
    </Box>
  );
};

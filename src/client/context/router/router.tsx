import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { BrowserRouter } from 'react-router';

type RouterProps = {
  readonly children?: React.ReactNode;
};

export const Router: React.FC<RouterProps> = ({ children }) => (
  <NuqsAdapter>
    <BrowserRouter>{children}</BrowserRouter>
  </NuqsAdapter>
);

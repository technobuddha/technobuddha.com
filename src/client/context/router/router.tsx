import React from 'react';
import { BrowserRouter } from 'react-router';

type RouterProps = {
  readonly children?: React.ReactNode;
};

export const Router: React.FC<RouterProps> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

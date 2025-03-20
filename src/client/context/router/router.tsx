import React from 'react';
import { BrowserRouter /*, useNavigate */ } from 'react-router';

type RouterProps = {
  children?: React.ReactNode;
};

export const Router: React.FC<RouterProps> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

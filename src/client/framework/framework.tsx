import React from 'react';
import { CssBaseline } from '@mui/material';

import { Authentication } from '#client/authentication';
import { Navigate, Route, Routes } from '#context/router';
import { userInterfaceSettings } from '#settings';

import { Cosmos } from './cosmos.tsx';

import css from './framework.module.css';

export const Framework: React.FC = () => (
  <>
    <CssBaseline />
    <div className={css.userInterface}>
      <Routes>
        <Route path="/forgot-password" element={<Authentication />} />
        <Route path="/login" element={<Authentication />} />
        <Route path="/sign-up" element={<Authentication />} />
        <Route path="/" element={<Navigate to={userInterfaceSettings.homePage} />} />
        <Route path="*" element={<Cosmos />} />
      </Routes>
    </div>
  </>
);

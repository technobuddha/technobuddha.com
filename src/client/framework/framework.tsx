import React from 'react';
import { CssBaseline } from '@mui/material';

import { Authentication } from '#client/authentication';
import { Navigate, Route, Routes } from '#context/router';
import { userInterfaceSettings } from '#settings/user-interface.ts';

import { Footer } from './footer.tsx';
import { Header } from './header.tsx';
import { Main } from './main.tsx';
import { Nav } from './nav.tsx';

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
        <Route
          path="*"
          element={
            <>
              <Header />
              <div className={css.frame}>
                <Nav className={css.nav} />
                <Main className={css.main} />
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  </>
);

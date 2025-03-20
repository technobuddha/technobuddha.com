import React from 'react';
import CssBaseLine from '@mui/material/CssBaseline';

import { Authentication } from '#client/authentication';
import { Navigate, Route, Routes } from '#context/router';
import { userInterfaceSettings } from '#settings/user-interface.js';

import { Footer } from './footer.js';
import { Header } from './header.js';
import { Main } from './main.js';
import { Nav } from './nav.js';

import css from './framework.module.css';

export const Framework: React.FC = () => (
  <>
    <CssBaseLine />
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

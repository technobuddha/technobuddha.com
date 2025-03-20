import React from 'react';
import { userInterfaceSettings } from '#settings/user-interface.js';
import { authenticationSettings } from '#settings/authentication';
import { Route, Routes, Navigate } from '#context/router';
import { useAuthentication } from '#context/authentication';
// import Box from '@mui/material/Box';
import { Nav } from './nav';
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';
import CssBaseLine from '@mui/material/CssBaseline';
import { Authentication } from '#client/authentication';
import css from './user-interface.module.css';
import { TextField } from '#control/text-field';

export const UserInterface: React.FC = () => {
  const authentication = useAuthentication();

  return (
    <>
      <CssBaseLine />
      <div className={css.userInterface}>
        <Routes>
          {/* <Route path="/login" Component={Authentication} />
          <Route path="/sign-up" Component={Authentication} />
          <Route path="forgot-password" Component={Authentication} />
          <Route path="/">
            <Navigate to={userInterfaceSettings.homePage} />
          </Route> */}
          {(!authenticationSettings.login || authentication.account != null) && (
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
          )}
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </Routes>
      </div>
    </>
  );
};

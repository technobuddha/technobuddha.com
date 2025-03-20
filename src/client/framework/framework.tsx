import React from 'react';
import CssBaseLine from '@mui/material/CssBaseline';

// import { Authentication } from '#client/authentication';
// import { useAuthentication } from '#context/authentication';
import { /*Navigate,*/ Navigate, Route, Routes } from '#context/router';
//import { TextField } from '#control/text-field';
import { authenticationSettings } from '#settings/authentication';
import { userInterfaceSettings } from '#settings/user-interface.js';

//import { userInterfaceSettings } from '#settings/user-interface.js';
import { Footer } from './footer.js';
import { Header } from './header.js';
import { Main } from './main.js';
// import Box from '@mui/material/Box';
import { Nav } from './nav.js';

import css from './framework.module.css';

export const Framework: React.FC = () => (
  // const authentication = useAuthentication();

  <>
    <CssBaseLine />
    <div className={css.userInterface}>
      <Routes>
        {/* <Route path="/login" Component={Authentication} />
          <Route path="/sign-up" Component={Authentication} />
          <Route path="forgot-password" Component={Authentication} />
           */}

        <Route path="/" element={<Navigate to={userInterfaceSettings.homePage} />} />
        {!authenticationSettings.login /*|| authentication.account != null*/ && (
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

import React, { Suspense } from 'react';

import { Framework } from '#client/framework/index.js';
import { IconProvider } from '#context/icon';
import { ThemeProvider } from '#context/mui';
import { Router } from '#context/router';
import { SnackbarProvider } from '#context/snackbar';
// import { APIProvider } from '#context/api';
// import { AuthenticationProvider } from '#context/authentication';
import { UserInterfaceProvider } from '#context/user-interface/index.js';

import { AppLoading } from './app-loading.js';

export const App: React.FC = () => (
  <Suspense fallback={<AppLoading />}>
    <IconProvider>
      <ThemeProvider>
        <SnackbarProvider>
          {/* <APIProvider> */}
          {/* <AuthenticationProvider> */}
          <Router>
            <UserInterfaceProvider>
              <Framework />
            </UserInterfaceProvider>
          </Router>
          {/* </AuthenticationProvider> */}
          {/* </APIProvider> */}
        </SnackbarProvider>
      </ThemeProvider>
    </IconProvider>
  </Suspense>
);

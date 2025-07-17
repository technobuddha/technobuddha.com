import React, { Suspense } from 'react';

import { Framework } from '#client/framework/index.js';
import { APIProvider } from '#context/api';
import { AuthenticationProvider } from '#context/authentication';
import { IconProvider } from '#context/icon';
import { theme, ThemeProvider } from '#context/mui';
import { Router } from '#context/router';
import { SnackbarProvider } from '#context/snackbar';
import { UserInterfaceProvider } from '#context/user-interface';
import ModalContainer from 'react-modal-promise';

import { AppLoading } from './app-loading.tsx';

export const App: React.FC = () => (
  <Suspense fallback={<AppLoading />}>
    <IconProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <APIProvider>
            <AuthenticationProvider>
              <Router>
                <UserInterfaceProvider>
                  <Framework />
                  <ModalContainer />
                </UserInterfaceProvider>
              </Router>
            </AuthenticationProvider>
          </APIProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </IconProvider>
  </Suspense>
);

import React, { Suspense } from 'react';

import { Framework } from '#client/framework/index.js';
import { APIProvider } from '#context/api';
import { AuthenticationProvider } from '#context/authentication';
import { IconProvider } from '#context/icon';
import { ThemeProvider } from '#context/mui';
import { Router } from '#context/router';
import { SnackbarProvider } from '#context/snackbar';
import { UserInterfaceProvider } from '#context/user-interface';

import { AppLoading } from './app-loading.tsx';

export const App: React.FC = () => (
  <Suspense fallback={<AppLoading />}>
    <IconProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <APIProvider>
            <AuthenticationProvider>
              <Router>
                <UserInterfaceProvider>
                  <Framework />
                </UserInterfaceProvider>
              </Router>
            </AuthenticationProvider>
          </APIProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </IconProvider>
  </Suspense>
);

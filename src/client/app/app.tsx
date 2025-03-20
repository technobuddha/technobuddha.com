import React, { Suspense } from 'react';
import { AuthenticationProvider } from '#context/authentication';
import { APIProvider } from '#context/api';
import { ComponentsProvider } from '#context/component';
import { IconProvider } from '#context/icon';
import { Router } from '#context/router';
import { SnackbarProvider } from '#context/snackbar';
import { ThemeProvider } from '#context/mui';
import { UserInterface } from '#client/user-interface';

import { AppLoading } from './app-loading.js';

export const App: React.FC = () => (
  <Suspense fallback={<AppLoading />}>
    <IconProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <APIProvider>
            <AuthenticationProvider>
              <ComponentsProvider>
                <Router>
                  <UserInterface />
                </Router>
              </ComponentsProvider>
            </AuthenticationProvider>
          </APIProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </IconProvider>
  </Suspense>
);

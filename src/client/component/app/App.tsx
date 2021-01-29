import { hot, setConfig }                   from 'react-hot-loader';
import React, { PureComponent, Suspense }   from 'react';                             // Load React AFTER hot loader
import { IconProvider }                     from '#context/icon';
import { ThemeProvider }                    from '#context/mui';
import { I18nProvider }                     from '#context/i18n';
import { SnackbarProvider }                 from '#context/snackbar';
import { APIProvider }                      from '#context/api';
import { AuthenticationProvider }           from '#context/authentication';
import { Router }                           from '#context/router';
import { ComponentsProvider }               from '#context/component';
import UserInterface                        from '#component/userInterface';
import AppLoading                           from './AppLoading';

setConfig({ showReactDomPatchNotification: false });

export const App = hot(module)(
    // eslint-disable-next-line react/prefer-stateless-function
    class extends PureComponent {
        public render() {
            return (
                <Suspense fallback={<AppLoading />}>
                    <IconProvider>
                        <ThemeProvider>
                            <I18nProvider>
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
                            </I18nProvider>
                        </ThemeProvider>
                    </IconProvider>
                </Suspense>
            );
        }
    }
);

export default App;

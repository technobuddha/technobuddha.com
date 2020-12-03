
import { hot, setConfig }                   from 'react-hot-loader';
import React, { PureComponent, Suspense }   from 'react';                             // Load React AFTER hot loader
import CircularProgress                     from '@material-ui/core/CircularProgress';
import { IconProvider }                     from '#context/icon';
import { ThemeProvider }                    from '#context/mui';
import { I18nProvider }                     from '#context/i18n';
import { SnackbarProvider }                 from '#context/snackbar';
import { AuthenticationProvider }           from '#context/authentication';
import { APIProvider }                      from '#context/api';
import { Router }                           from '#context/router';
import UserInteraface                       from './component/UserInterface';

setConfig({ showReactDomPatchNotification: false });

export const App = hot(module) (
    class extends PureComponent {
        public render() {
            return (
                <Suspense fallback={<CircularProgress />}>
                    <IconProvider>
                        <ThemeProvider>
                            <I18nProvider>
                                <SnackbarProvider>
                                    <APIProvider>
                                        <AuthenticationProvider>
                                            <Router>
                                                <UserInteraface />
                                            </Router>
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

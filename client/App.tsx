
import { hot, setConfig }                   from 'react-hot-loader';
import React, { PureComponent, Suspense }   from 'react';                             // Load React AFTER hot loader
import CircularProgress                     from '@material-ui/core/CircularProgress';
import { ThemeProvider }                    from './context/mui';
import { I18nProvider }                     from './context/i18n';
import { SnackbarProvider }                 from './context/snackbar';
//import { AuthenticationProvider }           from './context/authentication';
import { APIProvider }                      from './context/api';
import { Router }                           from './context/router';
import Body                                 from './component/Body';

setConfig({ showReactDomPatchNotification: false });

export const App = hot(module) (
    class extends PureComponent {
        public render() {
            return (
                <Suspense fallback={<CircularProgress />}>
                    <ThemeProvider>
                        <I18nProvider>
                            <SnackbarProvider>
                                <APIProvider>
                                    {/* <AuthenticationProvider> */}
                                        <Router>
                                            <Body />
                                        </Router>
                                    {/* </AuthenticationProvider> */}
                                </APIProvider>
                            </SnackbarProvider>
                        </I18nProvider>
                    </ThemeProvider>
                </Suspense>
            );
        }
    }
);

export default App;

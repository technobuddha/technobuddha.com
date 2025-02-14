import React                                from 'react';
import { SnackbarProvider as NotiSnack }    from 'notistack';

export const SnackbarProvider: React.FC = ({ children }: { children?: React.ReactNode }) => {
    return (
        <NotiSnack maxSnack={5} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            {children}
        </NotiSnack>
    );
};

export default SnackbarProvider;

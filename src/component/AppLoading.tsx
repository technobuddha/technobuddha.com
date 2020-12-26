import React             from 'react';
import CircularProgress  from '@material-ui/core/CircularProgress';

type AppLoadingProps = {
    children?: never;
}

export const AppLoading: React.FC<AppLoadingProps> = () => {
    return (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <CircularProgress />
        </div>
    );
}

export default AppLoading;

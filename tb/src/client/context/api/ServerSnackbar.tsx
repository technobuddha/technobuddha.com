import React                from 'react';
import Box                  from '@material-ui/core/Box';
import Typography           from '@material-ui/core/Typography';
import css                  from './ServerSnackbar.css';

type ServerErrorProps = {
    err: Error;
    children?: never;
};

export const ServiceNotification: React.FC<ServerErrorProps> = ({ err }) => {
    return (
        <Box className={css.serverError}>
            <Typography className={css.message}>
                {err.message}
            </Typography>
        </Box>
    );
};

export default ServiceNotification;

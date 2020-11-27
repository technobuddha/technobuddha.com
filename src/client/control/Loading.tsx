import React                    from 'react';
import Box                      from '@material-ui/core/Box';

export const Loading: React.FC = () => {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <img src="/assets/torchlight_loading_indicator.gif" style={{width: '100%'}} />
        </Box>
    );
}

export default Loading;

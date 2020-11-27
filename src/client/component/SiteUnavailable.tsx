import React            from 'react';
import Box              from '$client/control/Box';
import Typography       from '$client/control/Typography';
import useTranslation   from '$client/context/i18n';

export const SiteUnavailable: React.FC = () => {
    const { t }     = useTranslation();

    return (
        <Box display="flex" alignItems="center" width="100%" height="100%">
        <Box marginX="auto">
            <Typography variant="h3" component="span">
                {t('Site temporarly unavailable, please come back later.')}
            </Typography>
        </Box>
    </Box>
    )
}

export default SiteUnavailable;
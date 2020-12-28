import React            from 'react';
import Box              from '@material-ui/core/Box';
import Typography       from '@material-ui/core/Typography';
import useTranslation   from '#context/i18n';

export const SiteUnavailable: React.FC = () => {
    const { t }     = useTranslation();

    return (
        <Box display="flex" alignItems="center" width="100%" height="100%">
        <Box marginX="auto">
            <Typography variant="h3" component="span">
                {`${t('Site temporarily unavailable, please come back later')}.`}
            </Typography>
        </Box>
    </Box>
    )
}

export default SiteUnavailable;
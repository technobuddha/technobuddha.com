import React                from 'react';
import { useTranslation }     from '#context/i18n';
import Box                  from '@material-ui/core/Box';
import Typography           from '@material-ui/core/Typography';
import IconButton           from '@material-ui/core/IconButton';
import ExpandMore           from '@material-ui/icons/ExpandMore';
import ExpandLess           from '@material-ui/icons/ExpandLess';
import Collapse             from '@material-ui/core/Collapse';

type ServerErrorProps = {
    err:    Error;
};

export const ServerError: React.FC<ServerErrorProps> = ({ err }: ServerErrorProps) => {
    const { t }                     = useTranslation();
    const [ expanded, setExpanded ] = React.useState(false);

    const handleExpandClick = () => { setExpanded(!expanded); };

    return (
        <Box width="25vw">
            <Box display="flex" flexDirection="row" alignItems="center">
                <Box flexGrow={1}>
                    <Typography variant="subtitle2">{t('Server error')}</Typography>
                </Box>
                <Box>
                    <IconButton onClick={handleExpandClick} size="small">
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit={true}>
                <Typography gutterBottom={true}>
                    {err.message}
                </Typography>
            </Collapse>
        </Box>
    );
};

export default ServerError;

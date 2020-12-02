import React                from 'react';
import Button               from '@material-ui/core/Button';
import { makeStyles }       from '$client/context/mui';
import { useTranslation }   from '$client/context/i18n';
import Watermark            from '$client/control/Watermark';
import userAgent            from '~data/user-agent';
import packageJson          from '~package.json';

const useStyles = makeStyles(({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    }
}));

type BrowserGuardProps = {
    children?:  React.ReactElement;
}

export const BrowserGuard: React.FC<BrowserGuardProps> = ({children}: BrowserGuardProps = {}) => {
    const css   = useStyles();
    const { t } = useTranslation();
    const [ proceed, setProceed ] = React.useState(false);
    const handleClick = () => { setProceed(true); };

    if(children && (proceed || !userAgent.test(navigator.userAgent)))
        return children;

    return (
        <Watermark>
            <div className={css.root}>
                <div>{packageJson.name}</div>
                <div>{packageJson.version}</div>
                <div>{t('you is not compatible')}</div>
                <Button color="secondary" onClick={handleClick}>{t('Proceed')}</Button>
            </div>           
        </Watermark>

    )
}

export default BrowserGuard;

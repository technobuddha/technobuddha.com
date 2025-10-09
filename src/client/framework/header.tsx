import React from 'react';
import { MdAccountCircle } from 'react-icons/md';

import { useAuthentication } from '#context/authentication';
// import { useAuthentication } from '#context/authentication';
import { useTranslation } from '#context/i18n';
import { useNavigate } from '#context/router';
import { AppBar, Box, IconButton, Typography } from '#control';
import { authenticationSettings } from '#settings/authentication';

import css from './header.module.css' with { type: 'css' };

type HeaderProps = { children?: never };

export const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const { account } = useAuthentication();
  const { t } = useTranslation();

  const handleUserClick = React.useCallback((): void => {
    void navigate('/login');
  }, [navigate]);

  return (
    <AppBar className={css.header} position="static" elevation={1} component="header">
      <div className={css.display}>
        <Typography variant="h5" className={css.site}>
          {t('Technobuddha')}
        </Typography>
      </div>
      {authenticationSettings.login ?
        <Box className={css.controls}>
          <Box className={css.login}>
            {Boolean(account) && (
              <Typography>
                {account?.first} {account?.last}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleUserClick}>
            <MdAccountCircle className={css.authorization} />
          </IconButton>
        </Box>
      : null}
    </AppBar>
  );
};

import React from 'react';
import { authenticationSettings } from '#settings/authentication';
import { useAuthentication } from '#context/authentication';
import { useNavigate } from '#context/router';
import { useTranslation } from '#context/i18n';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { MdAccountCircle } from 'react-icons/md';
import css from './header.module.css';

type HeaderProps = { children?: never };

export const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const { account } = useAuthentication();
  const { t } = useTranslation();

  const handleUserClick = () => navigate('/login');

  return (
    <AppBar className={css.header} position="static" elevation={1} component="header">
      <div className={css.display}>
        <Typography variant="h5" className={css.site}>
          {t('Technobuddha')}
        </Typography>
      </div>
      {authenticationSettings.login && (
        <Box className={css.controls}>
          <Box className={css.login}>
            {account && (
              <Typography>
                {account.first} {account.last}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleUserClick}>
            <MdAccountCircle className={css.authorization} />
          </IconButton>
        </Box>
      )}
    </AppBar>
  );
};

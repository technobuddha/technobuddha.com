import React from 'react';

import { useAuthentication } from '#context/authentication';
import { useTranslation } from '#context/i18n';
import { useTheme } from '#context/mui';
import { useNavigate } from '#context/router';
import { Typography } from '#control';
import { MazeBackground } from '#page/maze';
import { type Page, pages } from '#settings/pages.tsx';

import Logo from './logo.svg?react';
import { Spinner } from './spinner.tsx';

import css from './home.module.css';

export type HomeProps = {
  children?: never;
};

export const Home: React.FC<HomeProps> = () => {
  const theme = useTheme();
  const { account } = useAuthentication();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translatedPages = React.useMemo(
    () => pages(t).filter((c) => c.active && (!c.loggedIn || account != null)),
    [t, account],
  );

  const handleClick = React.useCallback(
    (page: Page) => {
      void navigate(page.location);
    },
    [navigate],
  );

  return (
    <MazeBackground maskColor={theme.palette.primary.dark}>
      <div className={css.home}>
        <div className={css.introduction}>
          <Logo className={css.logo} />
          <Typography variant="h4" color={theme.palette.secondary.light}>
            {t('Technobuddha')}
          </Typography>
          <Typography variant="body1">
            {t(
              'A celebration of mathematics, programming and wasting time. Where sophisticated algorithms, are used for no particular reason.',
            )}
          </Typography>
          <Typography variant="body2" className={css.note}>
            {t(
              'Use the navigation buttons on the left to explore the wonders of the Technobuddha.',
            )}
          </Typography>
        </div>
        <div className={css.wheelOfComponents}>
          <Spinner components={translatedPages} onClick={handleClick}>
            {({ primary, secondary, description }) => (
              <div className={css.component}>
                <Typography variant="h4">{primary}</Typography>
                {Boolean(secondary) && <Typography variant="h5">{secondary}</Typography>}
                {Boolean(description) && <div className={css.description}>{description}</div>}
              </div>
            )}
          </Spinner>
        </div>
      </div>
    </MazeBackground>
  );
};

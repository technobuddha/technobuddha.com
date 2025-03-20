import React from 'react';
import { Typography } from '@mui/material';

import { MazeBackground } from '#component/maze/maze-background.jsx';
import { useTranslation } from '#context/i18n';
import { useTheme } from '#context/mui';
import { useNavigate } from '#context/router';
import { type Component, components } from '#settings/components.tsx';

import Logo from './logo.svg?react';
import { Spinner } from './spinner.tsx';

import css from './home.module.css';

export type HomeProps = {
  children?: never;
};

export const Home: React.FC<HomeProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translatedComponents = React.useMemo(() => components(t).filter((c) => c.active), [t]);

  const handleClick = React.useCallback(
    (component: Component) => {
      void navigate(component.location);
    },
    [navigate],
  );

  return (
    <MazeBackground maskColor={theme.palette.primary.dark}>
      <div className={css.home}>
        <div className={css.introduction}>
          <div className={css.logo}>
            <Logo />
          </div>
          <div className={css.blurb}>
            <div className={css.title}>Technobuddha</div>
            <div className={css.description}>
              A celebration of mathematics, programming and wasting time. Where sophisticated
              algorithms, are used for no particular reason.
            </div>
            <div className={css.note}>
              Use the navigation buttons on the left to explore the wonders of the Technobuddha.
            </div>
          </div>
        </div>
        <div className={css.wheelOfComponents}>
          <Spinner components={translatedComponents} onClick={handleClick}>
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

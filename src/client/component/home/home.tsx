import React from 'react';

import { MazeBackground } from '#component/maze/maze-background.jsx';
import { useTranslation } from '#context/i18n';
import { useTheme } from '#context/mui';
import { components } from '#settings/components.tsx';

import Logo from './logo.svg?react';
import { Spinner } from './spinner.tsx';

import css from './home.module.css';

export type HomeProps = {
  children?: never;
};

export const Home: React.FC<HomeProps> = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const translatedComponents = React.useMemo(() => components(t).filter((c) => c.active), [t]);
  const speed = 15;

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
          <Spinner speed={speed} components={translatedComponents} />
        </div>
      </div>
    </MazeBackground>
  );
};

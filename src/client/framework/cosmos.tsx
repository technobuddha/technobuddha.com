import React from 'react';

import { Footer } from './footer.tsx';
import { Header } from './header.tsx';
import { Main } from './main.tsx';
import { Nav } from './nav.tsx';

import css from './cosmos.module.css' with { type: 'css' };

export const Cosmos: React.FC = () => (
  <>
    <Header />

    <div className={css.frame}>
      <Nav className={css.nav} />
      <Main className={css.main} />
    </div>
    <Footer />
  </>
);

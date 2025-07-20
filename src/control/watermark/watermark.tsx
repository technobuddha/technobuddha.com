import React from 'react';

import css from './watermark.module.css';

export type WatermarkProps = {
  readonly children?: React.ReactNode;
};

export const Watermark: React.FC<WatermarkProps> = ({ children }) => (
  <main className={css.watermark}>
    <div className={css.logo} />
    <div className={css.contents}>{children}</div>
  </main>
);

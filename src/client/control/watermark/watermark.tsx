import React from 'react';
import css from './watermark.module.css';

type WatermarkProps = {
  children?: React.ReactNode;
};

export const Watermark: React.FC<WatermarkProps> = ({ children }) => {
  return (
    <main className={css.watermark}>
      <div className={css.logo} />
      {children}
    </main>
  );
};

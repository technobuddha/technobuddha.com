import { createRoot } from 'react-dom/client';

import { App } from './app/index.ts';

import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    container.style.position = 'relative';
    container.style.margin = '0px';
    container.style.padding = '0px';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';

    const root = createRoot(container);
    root.render(<App />);
  } else {
    document.body.style.margin = '0px';
    document.body.style.padding = '16px';
    document.body.textContent = 'Failed to mount React application';
  }
});

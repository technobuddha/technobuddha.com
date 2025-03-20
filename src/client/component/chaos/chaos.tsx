/* eslint-disable react/no-multi-comp */
import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Size } from '@technobuddha/mui-size';
import { useDerivedState } from '@technobuddha/react-hooks';

import { useTranslation } from '#context/i18n';

import { chaos } from './worker/index.js';

import css from './chaos.module.css';

type RGB = { r: number; g: number; b: number };

const SIZE = 1;
const MAX_ITERATION = 1024;

export const Chaos: React.FC = () => (
  <Size width="100%" height="100%">
    {({ width, height }) => <ChaosBoard boxWidth={width} boxHeight={height} />}
  </Size>
);

type ChaosBoardProps = { readonly boxWidth: number; readonly boxHeight: number };
type Mode = 'compute' | 'display';

const ChaosBoard: React.FC<ChaosBoardProps> = ({ boxWidth, boxHeight }: ChaosBoardProps) => {
  const { t } = useTranslation();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const overlay = React.useRef<HTMLCanvasElement>(null);
  const width = React.useMemo(() => Math.floor(boxWidth / SIZE), [boxWidth]);
  const height = React.useMemo(() => Math.floor(boxHeight / SIZE), [boxHeight]);
  const [mode, setMode] = useDerivedState<Mode>('compute', [width, height]);
  const [showLegend, setShowLegend] = React.useState(true);
  const grid = React.useRef<RGB[][]>([]);

  const xMin = React.useRef(-2.0);
  const xMax = React.useRef(+0.75);
  const yMin = React.useRef(-1.25);
  const yMax = React.useRef(+1.25);

  const mouseIsDown = React.useRef(false);
  const corner = React.useRef({ x: 0, y: 0 });

  const coordinates = (event: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const { top, left } = canvas.current!.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    return { x, y };
  };

  const scaledCoordinates = ({
    x: clientX,
    y: clientY,
  }: {
    x: number;
    y: number;
  }): { x: number; y: number } => {
    const x = xMin.current + (clientX / width) * (xMax.current - xMin.current);
    const y = yMin.current + (clientY / height) * (yMax.current - yMin.current);
    return { x, y };
  };

  const clearOverlay = React.useCallback((): CanvasRenderingContext2D => {
    overlay.current!.focus();

    const context = overlay.current!.getContext('2d')!;
    context.clearRect(0, 0, width, height);
    return context;
  }, [height, width]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (mode === 'display') {
      event.stopPropagation();
      event.preventDefault();

      if (event.button === 2) {
        const xMid = (xMin.current + xMax.current) / 2;
        const yMid = (yMin.current + yMax.current) / 2;

        xMin.current = xMid - (xMid - xMin.current) * Math.sqrt(10);
        xMax.current = xMid + (xMax.current - xMid) * Math.sqrt(10);
        yMin.current = yMid - (yMid - yMin.current) * Math.sqrt(10);
        yMax.current = yMid + (yMax.current - yMid) * Math.sqrt(10);
        setMode('compute');
      } else {
        mouseIsDown.current = true;
        corner.current = coordinates(event);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (mode === 'display' && mouseIsDown.current) {
      const click = coordinates(event);

      if (Math.abs(click.x - corner.current.x) < 10 || Math.abs(click.y - corner.current.y) < 10) {
        clearOverlay();
      } else {
        const first = scaledCoordinates(corner.current);
        const second = scaledCoordinates(click);

        xMin.current = Math.min(first.x, second.x);
        xMax.current = Math.max(first.x, second.x);
        yMin.current = Math.min(first.y, second.y);
        yMax.current = Math.max(first.y, second.y);
        setMode('compute');
      }
      mouseIsDown.current = false;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (mode === 'display' && mouseIsDown.current) {
      const { x, y } = coordinates(event);
      const context = clearOverlay();
      context.strokeStyle = 'white';
      context.strokeRect(x, y, corner.current.x - x, corner.current.y - y);
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>): boolean => {
    event.preventDefault();
    return false;
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLCanvasElement>): void => {
    if (event.key === 'Escape') {
      setShowLegend((show) => !show);
    }
  };

  React.useEffect(() => {
    if (mode === 'compute') {
      clearOverlay();

      chaos
        .mandelbrot(
          width,
          height,
          xMin.current,
          xMax.current,
          yMin.current,
          yMax.current,
          MAX_ITERATION,
        )
        .then((result) => {
          grid.current = result.colors;
          xMin.current = result.x_min;
          xMax.current = result.x_max;
          yMin.current = result.y_min;
          yMax.current = result.y_max;
          setMode('display');
        })

        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        }); // TODO [2025-05-01]: use snackbar to show error
    } else {
      setTimeout(() => {
        const context = canvas.current!.getContext('2d')!;
        context.translate(0.5, 0.5);
        const imageData = context.getImageData(0, 0, canvas.current!.width, canvas.current!.height);

        const setPixel = (x: number, y: number, r: number, g: number, b: number): void => {
          const offset = x * 4 + y * imageData.width * 4;
          imageData.data[offset + 0] = Math.round(r);
          imageData.data[offset + 1] = Math.round(g);
          imageData.data[offset + 2] = Math.round(b);
          imageData.data[offset + 3] = 255;
        };

        for (let i = 0; i < width; ++i) {
          for (let j = 0; j < height; ++j) {
            const rgb = grid.current[i][j];

            setPixel(i, j, rgb.r, rgb.g, rgb.b);
          }
        }

        context.putImageData(imageData, 0, 0);
      }, 0);
    }
  }, [clearOverlay, height, mode, setMode, width]);

  return (
    <div
      className={css.chaos}
      style={{ width: boxWidth, height: height }}
      onContextMenu={handleContextMenu}
    >
      {mode === 'compute' && (
        <div className={css.compute}>
          <div className={css.op}>{t('Computing')}</div>
          <div className={css.text}>{t('The Mandelbrot Set')}</div>
          <LinearProgress style={{ width: '50%' }} color="primary" />
        </div>
      )}
      {mode === 'display' && Boolean(showLegend) && (
        <div className={css.legend}>
          <div className={css.title}>{t('Controls')}</div>
          <div>{t('Show/hide legend')}</div>
          <div>{t('ESC')}</div>
          <div>{t('Zoom in')}</div>
          <div>{t('Left-click and drag')}</div>
          <div>{t('Zoom out')}</div>
          <div>{t('Right-click')}</div>
        </div>
      )}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight} />
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas
        ref={overlay}
        className={css.overlay}
        tabIndex={0}
        width={boxWidth}
        height={boxHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onKeyUp={handleKeyUp}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
};

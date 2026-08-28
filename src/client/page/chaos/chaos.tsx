/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import React from 'react';
import { LinearProgress } from '@technobuddha/controls';
import { Size, useDerivedState } from '@technobuddha/react';

import { useTranslation } from '#context/i18n';
import { enqueueSnackbar } from '#context/snackbar';

import { chaos } from './worker/index.ts';

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
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const overlayRef = React.useRef<HTMLCanvasElement>(null);
  const width = React.useMemo(() => Math.floor(boxWidth / SIZE), [boxWidth]);
  const height = React.useMemo(() => Math.floor(boxHeight / SIZE), [boxHeight]);
  const [mode, setMode] = useDerivedState<Mode>('compute', [width, height]);
  const [showLegend, setShowLegend] = React.useState(true);
  const gridRef = React.useRef<RGB[][]>([]);

  const xMinRef = React.useRef(-2.0);
  const xMaxRef = React.useRef(+0.75);
  const yMinRef = React.useRef(-1.25);
  const yMaxRef = React.useRef(+1.25);

  const mouseIsDownRef = React.useRef(false);
  const pillarRef = React.useRef({ x: 0, y: 0 });

  const coordinates = (event: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const { top, left } = canvasRef.current!.getBoundingClientRect();
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
    const x = xMinRef.current + (clientX / width) * (xMaxRef.current - xMinRef.current);
    const y = yMinRef.current + (clientY / height) * (yMaxRef.current - yMinRef.current);
    return { x, y };
  };

  const clearOverlay = React.useCallback((): CanvasRenderingContext2D => {
    overlayRef.current!.focus();

    const context = overlayRef.current!.getContext('2d')!;
    context.clearRect(0, 0, width, height);
    return context;
  }, [height, width]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (mode === 'display') {
      event.stopPropagation();
      event.preventDefault();

      if (event.button === 2) {
        const xMid = (xMinRef.current + xMaxRef.current) / 2;
        const yMid = (yMinRef.current + yMaxRef.current) / 2;

        xMinRef.current = xMid - (xMid - xMinRef.current) * Math.sqrt(10);
        xMaxRef.current = xMid + (xMaxRef.current - xMid) * Math.sqrt(10);
        yMinRef.current = yMid - (yMid - yMinRef.current) * Math.sqrt(10);
        yMaxRef.current = yMid + (yMaxRef.current - yMid) * Math.sqrt(10);
        setMode('compute');
      } else {
        mouseIsDownRef.current = true;
        pillarRef.current = coordinates(event);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (mode === 'display' && mouseIsDownRef.current) {
      const click = coordinates(event);

      if (
        Math.abs(click.x - pillarRef.current.x) < 10 ||
        Math.abs(click.y - pillarRef.current.y) < 10
      ) {
        clearOverlay();
      } else {
        const first = scaledCoordinates(pillarRef.current);
        const second = scaledCoordinates(click);

        xMinRef.current = Math.min(first.x, second.x);
        xMaxRef.current = Math.max(first.x, second.x);
        yMinRef.current = Math.min(first.y, second.y);
        yMaxRef.current = Math.max(first.y, second.y);
        setMode('compute');
      }
      mouseIsDownRef.current = false;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (mode === 'display' && mouseIsDownRef.current) {
      const { x, y } = coordinates(event);
      const context = clearOverlay();
      context.strokeStyle = 'white';
      context.strokeRect(x, y, pillarRef.current.x - x, pillarRef.current.y - y);
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
          xMinRef.current,
          xMaxRef.current,
          yMinRef.current,
          yMaxRef.current,
          MAX_ITERATION,
        )
        .then((result) => {
          gridRef.current = result.colors;
          xMinRef.current = result.x_min;
          xMaxRef.current = result.x_max;
          yMinRef.current = result.y_min;
          yMaxRef.current = result.y_max;
          setMode('display');
        })

        .catch((err) => {
          enqueueSnackbar({ message: err.message, variant: 'error' });
        });
    } else {
      const timer = setTimeout(() => {
        const context = canvasRef.current!.getContext('2d')!;
        context.translate(0.5, 0.5);
        const imageData = context.getImageData(
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height,
        );

        const setPixel = (x: number, y: number, r: number, g: number, b: number): void => {
          const offset = x * 4 + y * imageData.width * 4;
          imageData.data[offset + 0] = Math.round(r);
          imageData.data[offset + 1] = Math.round(g);
          imageData.data[offset + 2] = Math.round(b);
          imageData.data[offset + 3] = 255;
        };

        for (let i = 0; i < width; ++i) {
          for (let j = 0; j < height; ++j) {
            const rgb = gridRef.current[i][j];

            setPixel(i, j, rgb.r, rgb.g, rgb.b);
          }
        }

        context.putImageData(imageData, 0, 0);
        clearTimeout(timer);
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
      <canvas ref={canvasRef} className={css.canvas} width={boxWidth} height={boxHeight} />
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas
        ref={overlayRef}
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

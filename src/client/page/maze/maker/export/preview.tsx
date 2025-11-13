import React from 'react';
import { ceil } from '@technobuddha/library';
import { type Runner, type ShowDistances } from '@technobuddha/maze';

import css from './preview.module.css' with { type: 'css' };

export type PreviewProps = {
  readonly runner: Runner;
  readonly showSolution?: boolean;
  readonly transparentBackground?: boolean;
  readonly showDistances?: ShowDistances;
};

export const Preview: React.FC<PreviewProps> = ({
  runner,
  showSolution = false,
  transparentBackground = false,
  showDistances = 'none',
}) => {
  const { maze } = runner;
  const canvas = React.useRef<HTMLCanvasElement>(null);

  const { width, height, scale } = React.useMemo(() => {
    const drawing = maze.drawing!;
    const major = Math.max(drawing.width, drawing.height);
    const scale = 480 / major;

    return {
      width: ceil(drawing.width * scale),
      height: ceil(drawing.height * scale),
      scale,
    };
  }, [maze]);

  React.useEffect(() => {
    if (canvas.current && maze) {
      maze.export({
        canvas: canvas.current,
        scale,
        showSolution,
        transparentBackground,
        showDistances,
      });
    }

    return undefined;
  }, [maze, scale, showSolution, transparentBackground, showDistances]);

  return (
    <div className={css.preview}>
      <canvas ref={canvas} width={width} height={height} aria-label="Maze Preview" />
    </div>
  );
};

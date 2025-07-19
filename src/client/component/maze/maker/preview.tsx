import React from 'react';
import { ceil } from '@technobuddha/library';

import { CanvasDrawing } from '#maze/drawing';
import { type Runner } from '#maze/runner';

import css from './preview.module.css';

export type PreviewProps = {
  readonly runner: Runner;
  readonly showSolution?: boolean;
  readonly transparentBackground?: boolean;
};

export const Preview: React.FC<PreviewProps> = ({
  runner,
  showSolution = false,
  transparentBackground = false,
}) => {
  const { maze } = runner;
  const canvas = React.useRef<HTMLCanvasElement>(null);

  const { width, height, scale } = React.useMemo(() => {
    const drawing = maze.drawing!;
    const major = Math.max(drawing.width, drawing.height);
    const scale = 500 / major;

    return {
      width: ceil(drawing.width * scale),
      height: ceil(drawing.height * scale),
      scale,
    };
  }, [maze]);

  React.useEffect(() => {
    if (canvas.current && maze) {
      const draw = maze.attachDrawing(new CanvasDrawing(canvas.current, { zoom: scale }));

      const bg = maze.color.void;
      if (transparentBackground) {
        maze.color.void = 'transparent';
      }

      maze.draw();

      if (showSolution) {
        maze.drawSolution();
      }
      if (transparentBackground) {
        maze.color.void = bg;
      }

      maze.attachDrawing(draw);
    }

    return undefined;
  }, [maze, scale, showSolution, transparentBackground]);

  return (
    <div className={css.preview}>
      <canvas ref={canvas} width={width} height={height} aria-label="Maze Preview" />
    </div>
  );
};

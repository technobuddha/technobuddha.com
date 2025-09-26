import React from 'react';
import { type Phase, type Runner } from '@technobuddha/maze';

import { Button } from '#control';

import { exportMazeDialog } from './export-maze-dialog.tsx';

import css from './export.module.css';

export type ExportControlsProps = {
  readonly runner?: Runner;
  readonly children?: never;
};

export const ExportControls: React.FC<ExportControlsProps> = ({ runner }) => {
  const [wait, setWait] = React.useState(false);

  const exportMaze = React.useCallback(async () => {
    if (runner) {
      const playMode = runner.mode;
      runner.setMode('pause');
      await exportMazeDialog({ runner });
      runner.setMode(playMode);
    }
  }, [runner]);

  const handleExport = React.useCallback(() => {
    if (runner) {
      if (runner.phase === 'observe') {
        // open the export dialog now.
        void exportMaze();
      } else {
        // open the export dialog when the maze is finished.

        const listener = (e: Event): void => {
          const ce = e as CustomEvent<Phase>;
          const phase = ce.detail;

          if (phase === 'observe' || phase === 'exit') {
            runner.removeEventListener('phase', listener);
            setWait(false);

            setTimeout(() => {
              void exportMaze();
            });
          }
        };

        runner.addEventListener('phase', listener);
        setWait(true);
      }
    }
  }, [runner, exportMaze]);

  return (
    <div className={css.export}>
      <Button onClick={handleExport} loading={wait}>
        Export Maze Image
      </Button>
    </div>
  );
};

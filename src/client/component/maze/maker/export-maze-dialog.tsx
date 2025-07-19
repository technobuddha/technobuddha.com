/* eslint-disable unicorn/consistent-destructuring */
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { create, type InstanceProps } from 'react-modal-promise';

import { Checkbox } from '#control';
import { CanvasDrawing } from '#maze/drawing';
import { type Runner } from '#maze/runner';

import { Preview } from './preview.tsx';

export type ExportMazeDialogProps = InstanceProps<void, void> & {
  readonly runner: Runner;
  readonly children?: never;
};

export const ExportMazeDialog: React.FC<ExportMazeDialogProps> = ({
  runner,
  isOpen,
  onResolve,
}) => {
  const [showSolution, setShowSolution] = React.useState(false);
  const [transparentBackground, setTransparentBackground] = React.useState(false);
  const [format, setFormat] = React.useState<'png' | 'jpg' | 'gif'>('png');

  const handleSolutionChange = React.useCallback((checked: boolean) => {
    setShowSolution(checked);
  }, []);

  const handleTransparentBackgroundChange = React.useCallback((checked: boolean) => {
    setTransparentBackground(checked);
  }, []);

  const handleFormatChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat(event.target.value as 'png' | 'jpg' | 'gif');
    if (event.target.value === 'jpg') {
      setTransparentBackground(false); // JPG does not support transparency
    }
  }, []);

  const handleCancel = React.useCallback(() => {
    onResolve();
  }, [onResolve]);

  const handleNothing = React.useCallback(() => {
    if (runner) {
      const { maze } = runner;
      if (maze) {
        const { drawing } = maze;
        if (drawing) {
          const canvas = document.createElement('canvas');
          canvas.width = drawing.width;
          canvas.height = drawing.height;

          const draw = maze.attachDrawing(new CanvasDrawing(canvas));

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

          const dataUrl = canvas.toDataURL(
            format === 'jpg' ? 'image/jpeg'
            : format === 'gif' ? 'image/gif'
            : 'image/png',
          );

          const a = document.createElement('a');
          a.download = `maze.${format}`;
          a.href = dataUrl;
          a.click();

          onResolve();
        }
      }
    }
  }, [onResolve, runner, showSolution, transparentBackground, format]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Export Maze</DialogTitle>
      <DialogContent>
        <div>
          {Boolean(runner) && (
            <div>
              <Preview
                runner={runner}
                showSolution={showSolution}
                transparentBackground={transparentBackground}
              />
            </div>
          )}
          <div>
            <Checkbox
              label="Show Solution"
              checked={showSolution}
              onChange={handleSolutionChange}
              color="primary"
            />
            <Checkbox
              label="Transparent Background"
              checked={transparentBackground}
              disabled={format === 'jpg'}
              onChange={handleTransparentBackgroundChange}
              color="primary"
            />
          </div>
          <div>
            <FormControl>
              <FormLabel id="export-format-label">Export Format</FormLabel>
              <RadioGroup
                row
                aria-labelledby="export-format-label"
                value={format}
                onChange={handleFormatChange}
              >
                <FormControlLabel value="png" control={<Radio />} label="png" />
                <FormControlLabel value="jpg" control={<Radio />} label="jpg" />
                <FormControlLabel value="gif" control={<Radio />} label="gif" />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleNothing}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export const exportMazeDialog = create<ExportMazeDialogProps>(ExportMazeDialog);

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

import { Checkbox, MenuItem, Select } from '#control';
import { type ShowDistances } from '#maze/geometry';
import { type Runner } from '#maze/runner';

import { Preview } from './preview.tsx';

import css from './export-maze-dialog.module.css';

type FileFormat = 'png' | 'jpg' | 'gif';

const mimeTypes: Record<FileFormat, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
};

export type ExportMazeDialogProps = InstanceProps<void, void> & {
  readonly runner: Runner;
  readonly children?: never;
};

export const ExportMazeDialog: React.FC<ExportMazeDialogProps> = ({
  runner,
  isOpen,
  onResolve,
}) => {
  const [showSolution, setShowSolution] = React.useState(true);
  const [transparentBackground, setTransparentBackground] = React.useState(false);
  const [format, setFormat] = React.useState<FileFormat>('png');
  const [showDistances, setShowDistances] = React.useState<ShowDistances>(
    runner.maze.showDistances ?? 'none',
  );

  const handleSolutionChange = React.useCallback((checked: boolean) => {
    setShowSolution(checked);
  }, []);

  const handleTransparentBackgroundChange = React.useCallback((checked: boolean) => {
    setTransparentBackground(checked);
  }, []);

  const handleShowDistancesChange = React.useCallback((value: ShowDistances) => {
    setShowDistances(value);
  }, []);

  const handleFormatChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat(event.target.value as FileFormat);
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

          maze.export({ canvas, showSolution, transparentBackground, showDistances });

          const dataUrl = canvas.toDataURL(mimeTypes[format]);

          const a = document.createElement('a');
          a.download = `maze.${format}`;
          a.href = dataUrl;
          a.click();

          onResolve();
        }
      }
    }
  }, [runner, showSolution, transparentBackground, showDistances, format, onResolve]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Export Maze</DialogTitle>
      <DialogContent>
        <div className={css.exportMazeDialog}>
          {Boolean(runner) && (
            <div>
              <Preview
                runner={runner}
                showSolution={showSolution}
                transparentBackground={transparentBackground}
                showDistances={showDistances}
              />
            </div>
          )}
          <div className={css.options}>
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
            <Select
              label="Show Distances"
              value={showDistances}
              onChange={handleShowDistancesChange}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="greyscale">Greyscale</MenuItem>
              <MenuItem value="primary">Primary</MenuItem>
              <MenuItem value="color">Color</MenuItem>
              <MenuItem value="spectrum">Spectrum</MenuItem>
            </Select>
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

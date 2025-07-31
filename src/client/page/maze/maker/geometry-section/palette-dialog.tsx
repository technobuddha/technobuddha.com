import React from 'react';
import { toTitleCase } from '@technobuddha/library';
import { create, type InstanceProps } from 'react-modal-promise';

import {
  Button,
  ColorPicker,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  Tooltip,
} from '#control';
import { defaultColors, type MazeColors } from '#maze/geometry';

import css from './palette-dialog.module.css';

export type PaletteDialogProps = InstanceProps<MazeColors, void> & {
  readonly value: MazeColors;
  readonly children?: never;
};

export const PaletteDialog: React.FC<PaletteDialogProps> = ({
  value,
  isOpen,
  onResolve,
  onReject,
}) => {
  const [colors, setColors] = React.useState<MazeColors>(value);
  const [selected, setSelected] = React.useState<keyof MazeColors>('cell');

  const handleSelectionChange = React.useCallback(
    (checked: boolean, value: string) => {
      if (checked) {
        setSelected(value as keyof MazeColors);
      }
    },
    [setSelected],
  );

  const handleColorChange = React.useCallback(
    (color: string) => {
      setColors((prevColors) => ({
        ...prevColors,
        [selected]: color,
      }));
    },
    [selected],
  );

  const handleDefault = React.useCallback(() => {
    setColors(defaultColors);
  }, []);

  const handleCancel = React.useCallback(() => {
    onReject();
  }, [onReject]);

  const handleSave = React.useCallback(() => {
    onResolve(colors);
  }, [onResolve, colors]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Palette Settings</DialogTitle>
      <DialogContent>
        <div className={css.content}>
          <div className={css.colors}>
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className={css.color}>
                <div className={css.name}>
                  <Radio
                    value={key}
                    label={toTitleCase(key)}
                    checked={key === selected}
                    onChange={handleSelectionChange}
                  />
                </div>
                <div className={css.swatch}>
                  <Tooltip title={value} placement="top">
                    <div style={{ backgroundColor: value }}>&nbsp;</div>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
          <div className={css.picker}>
            <ColorPicker
              className={css.colorPicker}
              value={colors[selected]}
              onChange={handleColorChange}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleDefault}>
          Reset to Default
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export const paletteDialog = create<PaletteDialogProps>(PaletteDialog);

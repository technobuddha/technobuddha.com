import React from 'react';
import { create, type InstanceProps } from 'react-modal-promise';

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from '#control';

import { type Debug, shows } from './debug.ts';

import css from './debug-dialog.module.css';

function findShow(showBridges: boolean, showCoordinates: boolean, showKind: boolean): string {
  return (
    shows.find(
      (s) =>
        s.showBridges === showBridges &&
        s.showCoordinates === showCoordinates &&
        s.showKind === showKind,
    )?.title ?? 'None'
  );
}

function parseShow(show: string): Pick<Debug, 'showBridges' | 'showCoordinates' | 'showKind'> {
  const selection = shows.find((s) => s.title === show);
  return {
    showBridges: selection?.showBridges ?? false,
    showCoordinates: selection?.showCoordinates ?? false,
    showKind: selection?.showKind ?? false,
  };
}

export type DebugDialogProps = InstanceProps<Debug, void> & {
  readonly children?: never;
  readonly value: Debug;
};

export const DebugDialog: React.FC<DebugDialogProps> = ({ value, isOpen, onResolve, onReject }) => {
  const [show, setShow] = React.useState<string>(
    findShow(value.showBridges, value.showCoordinates, value.showKind),
  );
  const [announceMaze, setAnnounceMaze] = React.useState(value.announceMaze);
  const [showUnreachables, setShowUnreachables] = React.useState(value.showUnreachables);

  const handleShowChange = React.useCallback((newValue: string) => {
    setShow(newValue);
  }, []);

  const handleAnnounceChange = React.useCallback(
    (newValue: boolean) => {
      setAnnounceMaze(newValue);
    },
    [setAnnounceMaze],
  );

  const handleShowUnreachablesChange = React.useCallback(
    (newValue: boolean) => {
      setShowUnreachables(newValue);
    },
    [setShowUnreachables],
  );

  const handleCancel = React.useCallback(() => {
    onReject();
  }, [onReject]);

  const handleSave = React.useCallback(() => {
    onResolve({ ...parseShow(show), announceMaze, showUnreachables });
  }, [onResolve, show, announceMaze, showUnreachables]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Debug Settings</DialogTitle>
      <DialogContent>
        <div className={css.content}>
          <Select label="Cell Identification" value={show} onChange={handleShowChange}>
            {shows.map((m) => (
              <MenuItem key={m.title} value={m.title}>
                {m.title}
              </MenuItem>
            ))}
          </Select>
          <Checkbox
            checked={announceMaze}
            label="Announce maze in messages"
            onChange={handleAnnounceChange}
          />
          <Checkbox
            checked={showUnreachables}
            label="Show unreachable cells in maze"
            onChange={handleShowUnreachablesChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export const debugDialog = create<DebugDialogProps>(DebugDialog);

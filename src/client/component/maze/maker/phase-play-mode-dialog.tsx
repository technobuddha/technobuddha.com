import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { toCapitalCase } from '@technobuddha/library';
import { create, type InstanceProps } from 'react-modal-promise';

import { Button, Typography } from '#control';
import { type Phase, type PlayMode, playModeIcons, playModes } from '#maze/runner';

export type PhasePlayModeDialogProps = InstanceProps<PlayMode | undefined, void> & {
  readonly children?: never;
  readonly phase: Phase;
  readonly value: PlayMode | undefined;
};

export const PhasePlayModeDialog: React.FC<PhasePlayModeDialogProps> = ({
  phase,
  value,
  isOpen,
  onResolve,
  onReject,
}) => {
  const handleCancel = React.useCallback(() => {
    onReject();
  }, [onReject]);

  const handleChange = React.useCallback(
    (_event: React.MouseEvent<HTMLElement>, newValue: PlayMode) => {
      onResolve(newValue);
    },
    [onResolve],
  );

  const myPlayModes = React.useMemo(
    () =>
      playModes.filter((mode) =>
        phase === 'generate' || phase === 'solve' || phase === 'braid' ?
          mode !== 'step' && mode !== 'refresh'
        : mode !== 'step' && mode !== 'play' && mode !== 'fast' && mode !== 'instant',
      ),
    [phase],
  );

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Phase {toCapitalCase(phase)}</DialogTitle>
      <DialogContent>
        <Typography>
          When the {phase === 'observe' ? 'final' : phase} phase is started, which play mode should
          be used?
        </Typography>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <ToggleButtonGroup color="primary" value={value} exclusive onChange={handleChange}>
            {myPlayModes.map((mode) => (
              <ToggleButton key={mode} value={mode} fullWidth>
                {playModeIcons[mode]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export const phasePlayModeDialog = create<PhasePlayModeDialogProps>(PhasePlayModeDialog);

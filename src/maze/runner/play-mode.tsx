import {
  IoFootsteps,
  IoPause,
  IoPlay,
  IoPlayForward,
  IoPlaySkipForward,
  IoRefresh,
} from 'react-icons/io5';

export const playModes = ['pause', 'step', 'play', 'fast', 'instant', 'refresh'] as const;
export type PlayMode = (typeof playModes)[number];

export const playModeIcons: Record<PlayMode, React.ReactNode> = {
  pause: <IoPause />,
  step: <IoFootsteps />,
  play: <IoPlay />,
  fast: <IoPlayForward />,
  instant: <IoPlaySkipForward />,
  refresh: <IoRefresh />,
};

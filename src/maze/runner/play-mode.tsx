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
  pause: <IoPause size="1em" />,
  step: <IoFootsteps size="1em" />,
  play: <IoPlay size="1em" />,
  fast: <IoPlayForward size="1em" />,
  instant: <IoPlaySkipForward size="1em" />,
  refresh: <IoRefresh size="1em" />,
};

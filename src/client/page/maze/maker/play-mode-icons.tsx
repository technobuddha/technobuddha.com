import {
  IoFootsteps,
  IoPause,
  IoPlay,
  IoPlayForward,
  IoPlaySkipForward,
  IoRefresh,
} from 'react-icons/io5';

import { type PlayMode } from '#maze/runner';

export const playModeIcons: Record<PlayMode, React.ReactNode> = {
  pause: <IoPause />,
  step: <IoFootsteps />,
  play: <IoPlay />,
  fast: <IoPlayForward />,
  instant: <IoPlaySkipForward />,
  refresh: <IoRefresh />,
};

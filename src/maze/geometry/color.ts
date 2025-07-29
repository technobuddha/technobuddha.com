export type MazeColors = {
  cell: string;
  wall: string;
  void: string;
  tunnel: string;
  bridge: string;
  entrance: string;
  exit: string;
  avatar: string;
  solution: string;
  path: string;
  scanned: string;
  pruned: string;
  blocked: string;
  error: string;
  text: string;
};

export const defaultColors: NonNullable<MazeColors> = {
  cell: 'oklch(0 0 0)',
  wall: 'oklch(0.80 0 0)',
  void: 'oklch(0.33 0 0)',
  tunnel: 'oklch(0.96 0.064 196)',
  bridge: 'oklch(0.44 0.025 240)',
  entrance: 'oklch(0.62 0.21 142)',
  exit: 'oklch(0.62 0.26 29)',
  avatar: 'oklch(0.66 0.11 213)',
  solution: 'oklch(0.70 0.18 144)',
  path: 'oklch(0.81 0.17 83)',
  scanned: 'oklch(0.52 0.22 330)',
  pruned: 'oklch(0.44 0.18 359)',
  blocked: 'oklch(0.63 0.21 27)',
  error: 'oklch(0.48 0.17 28)',
  text: 'oklch(1 0 0)',
};

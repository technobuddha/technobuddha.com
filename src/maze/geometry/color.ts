export type MazeColors = {
  void: string;
  cell: string;
  wall: string;
  mask: string;
  entrance: string;
  exit: string;
  tunnel: string;
  solution: string;
  scanned: string;
  avatar: string;
  pruned: string;
  path: string;
  blocked: string;
  error: string;
  bridge: string;
  text: string;
};

export const defaultColors: NonNullable<MazeColors> = {
  void: 'oklch(0.33 0 0)',
  cell: 'oklch(0 0 0)',
  wall: 'oklch(0.80 0 0)',
  mask: 'oklch(0 0 0)',
  entrance: 'oklch(0.5198 0.176858 142.4953)',
  exit: 'oklch(0.628 0.2577 29.23)',
  solution: 'oklch(0.6611 0.115 213.72)',
  scanned: 'oklch(0.6373 0.2035 143.01)', //'oklch(0.5789 0.2344 0.51)',
  avatar: 'oklch(0.6611 0.115 213.72)',
  pruned: 'oklch(0.4446 0.1803 359.81)',
  blocked: 'oklch(0.6298 0.2145 27.83)',
  error: 'oklch(0.8664 0.294827 142.4953)',
  path: 'oklch(0.8145 0.1672 83.88)',
  tunnel: 'oklch(0.9544 0.0637 196.13)',
  bridge: 'oklch(0.25 0 0)',
  text: 'oklch(1 0 0)',
};

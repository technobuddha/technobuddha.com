export const playModes = ['pause', 'step', 'play', 'fast', 'instant', 'refresh'] as const;
export type PlayMode = (typeof playModes)[number];

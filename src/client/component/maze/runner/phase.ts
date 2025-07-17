export const phases = ['maze', 'generate', 'braid', 'solve', 'final', 'observe', 'exit'] as const;

export type Phase = (typeof phases)[number];

import { SquareMaze, type SquareMazeProperties } from '../geometry/index.ts';
import { type Choices } from '../library/chooser.ts';

type PropsMazeGeometry = { geometry: typeof SquareMaze } & SquareMazeProperties;

export const mazes: Choices<PropsMazeGeometry> = [
  {
    weight: 1,
    items: [
      {
        weight: 1,
        title: 'Square',
        props: { geometry: SquareMaze, cellSize: 24, wallSize: 2, gapSize: 2 },
      },
      {
        weight: 1,
        title: 'Tiny',
        props: {
          geometry: SquareMaze,
          cellSize: 12,
          wallSize: 1,
          gapSize: 0,
        },
      },
      {
        weight: 1,
        title: 'Large',
        props: {
          geometry: SquareMaze,
          cellSize: 32,
          wallSize: 1,
          gapSize: 0,
        },
      },
      {
        weight: 1,
        title: 'Mine',
        props: {
          geometry: SquareMaze,
          cellSize: 20,
          wallSize: 5,
          gapSize: 0,
        },
      },
    ],
  },
];

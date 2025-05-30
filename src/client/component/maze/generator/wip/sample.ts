import { MazeGenerator, type MazeGeneratorProperties } from '../maze-generator.ts';

const steps = [
  { x: 0, y: 0, direction: 's' },
  { x: 0, y: 1, direction: 'e' },
  { x: 1, y: 1, direction: 'e' },
  { x: 2, y: 1, direction: 'e' },
  { x: 3, y: 1, direction: 'e' },
  { x: 4, y: 1, direction: 'e' },
  { x: 5, y: 1, direction: 'e' },
  { x: 6, y: 1, direction: 'e' },
  { x: 7, y: 1, direction: 'e' },
  { x: 8, y: 1, direction: 'e' },
  { x: 9, y: 1, direction: 'e' },
  { x: 10, y: 1, direction: 'e' },
  { x: 11, y: 1, direction: 'e' },
  { x: 0, y: 1, direction: 's' },
  { x: 0, y: 1, direction: 's' },
  { x: 6, y: 1, direction: 's' },
  { x: 12, y: 1, direction: 's' },
  { x: 0, y: 2, direction: 's' },
  { x: 6, y: 2, direction: 's' },
  { x: 12, y: 2, direction: 's' },
  { x: 0, y: 3, direction: 's' },
  { x: 6, y: 3, direction: 's' },
  { x: 12, y: 3, direction: 's' },
  { x: 0, y: 4, direction: 'e' },
  { x: 1, y: 4, direction: 'e' },
  { x: 2, y: 4, direction: 'e' },
  { x: 3, y: 4, direction: 'e' },
  { x: 4, y: 4, direction: 'e' },
  { x: 5, y: 4, direction: 'e' },
  { x: 6, y: 4, direction: 'e' },
  { x: 7, y: 4, direction: 'e' },
  { x: 8, y: 4, direction: 'e' },
  { x: 9, y: 4, direction: 'e' },
  { x: 10, y: 4, direction: 'e' },
  { x: 11, y: 4, direction: 'e' },
  { x: 0, y: 4, direction: 's' },
  { x: 3, y: 4, direction: 's' },
  { x: 9, y: 4, direction: 's' },
  { x: 12, y: 4, direction: 's' },
  { x: 0, y: 5, direction: 's' },
  { x: 3, y: 5, direction: 's' },
  { x: 9, y: 5, direction: 's' },
  { x: 12, y: 5, direction: 's' },
  { x: 0, y: 6, direction: 's' },
  { x: 3, y: 6, direction: 's' },
  { x: 9, y: 6, direction: 's' },
  { x: 12, y: 6, direction: 's' },
  { x: 0, y: 7, direction: 's' },
  { x: 12, y: 7, direction: 's' },
  { x: 3, y: 7, direction: 'e' },
  { x: 4, y: 7, direction: 'e' },
  { x: 5, y: 7, direction: 'e' },
  { x: 6, y: 7, direction: 'e' },
  { x: 7, y: 7, direction: 'e' },
  { x: 8, y: 7, direction: 'e' },
  { x: 3, y: 7, direction: 's' },
  { x: 9, y: 7, direction: 's' },
  { x: 0, y: 8, direction: 's' },
  { x: 3, y: 8, direction: 's' },
  { x: 9, y: 8, direction: 's' },
  { x: 12, y: 8, direction: 's' },
  { x: 0, y: 9, direction: 's' },
  { x: 3, y: 9, direction: 's' },
  { x: 9, y: 9, direction: 's' },
  { x: 12, y: 9, direction: 's' },
  { x: 0, y: 10, direction: 'e' },
  { x: 1, y: 10, direction: 'e' },
  { x: 2, y: 10, direction: 'e' },
  { x: 3, y: 10, direction: 'e' },
  { x: 4, y: 10, direction: 'e' },
  { x: 5, y: 10, direction: 'e' },
  { x: 6, y: 10, direction: 'e' },
  { x: 7, y: 10, direction: 'e' },
  { x: 8, y: 10, direction: 'e' },
  { x: 9, y: 10, direction: 'e' },
  { x: 10, y: 10, direction: 'e' },
  { x: 11, y: 10, direction: 'e' },
  { x: 0, y: 10, direction: 's' },
  { x: 0, y: 10, direction: 's' },
  { x: 6, y: 10, direction: 's' },
  { x: 12, y: 10, direction: 's' },
  { x: 0, y: 11, direction: 's' },
  { x: 0, y: 11, direction: 's' },
  { x: 6, y: 11, direction: 's' },
  { x: 12, y: 11, direction: 's' },
  { x: 0, y: 12, direction: 's' },
  { x: 0, y: 12, direction: 's' },
  { x: 6, y: 12, direction: 's' },
  { x: 12, y: 12, direction: 's' },
  { x: 0, y: 13, direction: 'e' },
  { x: 1, y: 13, direction: 'e' },
  { x: 2, y: 13, direction: 'e' },
  { x: 3, y: 13, direction: 'e' },
  { x: 4, y: 13, direction: 'e' },
  { x: 5, y: 13, direction: 'e' },
  { x: 6, y: 13, direction: 'e' },
  { x: 7, y: 13, direction: 'e' },
  { x: 8, y: 13, direction: 'e' },
  { x: 9, y: 13, direction: 'e' },
  { x: 10, y: 13, direction: 'e' },
  { x: 11, y: 13, direction: 'e' },
  { x: 12, y: 13, direction: 's' },
];

export class Sample extends MazeGenerator {
  private readonly steps = [...steps];

  public constructor(props: MazeGeneratorProperties) {
    super(props);
  }

  public override step(): boolean {
    const step = this.steps.shift();
    if (step) {
      this.maze.removeWall(step, step.direction);
      return true;
    }
    return false;
  }
}

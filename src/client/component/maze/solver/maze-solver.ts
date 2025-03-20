import { type Drawing } from '../drawing/drawing.js';
import { type CellDirection, type Maze } from '../maze/maze.js';

export type MazeSolverProperties = {
  maze: Maze;
  context: Drawing;
};

export type SolveArguments = {
  color?: string;
  entrance?: CellDirection;
  exit?: CellDirection;
};

export abstract class MazeSolver {
  protected maze: MazeSolverProperties['maze'];
  protected context: MazeSolverProperties['context'];

  public constructor({ maze, context }: MazeSolverProperties) {
    this.maze = maze;
    this.context = context;
  }

  public abstract solve({ color, entrance, exit }: SolveArguments): Promise<void>;
}

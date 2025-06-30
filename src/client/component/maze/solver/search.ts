import { create2DArray } from '@technobuddha/library';

import { darken } from '../library/darken.ts';

import { type MazeSolverProperties } from './maze-solver.ts';
import { MazeSolver } from './maze-solver.ts';
import { BacktrackingRobot, type Program } from './robot/index.ts';

export type SearchProperties = MazeSolverProperties & {
  avatarColor?: string;
  pathColor?: string;
  program?: Program;
};

export class Search extends MazeSolver {
  public readonly avatarColor: string;
  public readonly pathColor: string;

  protected readonly program: NonNullable<SearchProperties['program']>;
  protected bias = false;

  public constructor({
    maze,
    avatarColor = maze.avatarColor,
    pathColor = maze.pathColor,
    program = 'random',
    ...props
  }: SearchProperties) {
    super({ maze, ...props });
    this.avatarColor = avatarColor;
    this.pathColor = pathColor;
    this.program = program;
  }
  public async *solve({
    pathColor = this.pathColor,
    avatarColor = this.avatarColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    const blocked = create2DArray(this.maze.width, this.maze.height, false);

    using robot = new BacktrackingRobot({
      maze: this.maze,
      program: this.program,
      location: entrance,
      color: avatarColor,
      blocked,
    });

    while (!this.maze.isSame(robot.location, exit)) {
      robot.execute();

      const cell = this.maze.makePath(robot.path()).at(-1);
      if (cell) {
        this.maze.drawCell(cell);
        this.maze.drawPath(cell, cell.tunnel ? darken(pathColor, 0.5) : pathColor);
      }
      yield;
    }

    this.maze.solution = this.maze.makePath(robot.path());
  }
}

import { create2DArray } from '@technobuddha/library';

import { Robot, type RobotProperties } from './robot.ts';
import { RobotError } from './robot-error.ts';

export type BacktrackingRobotProperties = RobotProperties & {
  showMarks?: boolean;
  blocked?: boolean[][];
};

export class BacktrackingRobot extends Robot {
  public algorithm = 'backtracking';
  private readonly blocked: boolean[][];
  private readonly showMarks: boolean;

  public constructor({ maze, blocked, showMarks = false, ...props }: BacktrackingRobotProperties) {
    super({ maze, ...props });
    this.showMarks = showMarks;
    this.blocked = blocked ?? create2DArray(this.maze.width, this.maze.height, false);

    const cc = this.clearCell;
    this.clearCell = (cell) => {
      cc(cell);
      if (this.showMarks && this.blocked[cell.x][cell.y]) {
        this.maze.drawX(cell);
      }
    };
  }

  public execute(): void {
    this.clearCell(this.location);

    const moves = this.maze
      .moves(this.location, { wall: false })
      .filter(
        ({ target }) =>
          !this.maze.isSame(target, this.previous) &&
          !this.blocked[target.x][target.y] &&
          !this.history.some((cell) => this.maze.isSame(cell, target)),
      );

    if (moves.length === 0) {
      if (this.showMarks) {
        this.maze.drawX(this.location);
      }
      this.blocked[this.location.x][this.location.y] = true;

      this.backtrack();
    } else {
      const next = this.decide(moves);
      if (next) {
        this.moveTo(next.target);
      } else {
        throw new RobotError(`${this.name} cannot decide on a move`, this.color);
      }
    }
  }
}

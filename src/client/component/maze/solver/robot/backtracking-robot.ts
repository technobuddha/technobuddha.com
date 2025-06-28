import { create2DArray } from '@technobuddha/library';

import { Robot, type RobotProperties } from './robot.ts';

export type BacktrackingRobotProperties = RobotProperties & {
  blocked?: boolean[][];
};

export class BacktrackingRobot extends Robot {
  private readonly blocked: boolean[][];

  public constructor({ maze, blocked, ...props }: BacktrackingRobotProperties) {
    super({ maze, ...props });
    this.blocked = blocked ?? create2DArray(this.maze.width, this.maze.height, false);
  }

  public execute(): void {
    const previous = this.previousLocation();

    this.clearCell(this.location);

    const moves = this.maze
      .moves(this.location, { wall: false })
      .filter(({ move }) => !this.maze.isSame(move, previous) && !this.blocked[move.x][move.y]);

    if (moves.length === 0) {
      if (this.trails === 0) {
        this.maze.drawX(this.location);
      }
      this.blocked[this.location.x][this.location.y] = true;
      this.location = previous!;

      this.clearCell(this.location);
      this.maze.drawAvatar(this.location, this.color);
      this.history.pop();
    } else {
      const next = this.decide(moves, this.location);
      if (next) {
        this.moveTo(next.move);
      } else {
        throw new Error(`BacktrackingRobot cannot move from ${this.location.x},${this.location.y}`);
      }
    }
  }

  public override dispose(): void {
    this.clearCell(this.location);
  }
}

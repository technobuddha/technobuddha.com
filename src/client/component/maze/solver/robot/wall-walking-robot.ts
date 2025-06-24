import { type Cell, type Direction } from '../../geometry/maze.ts';
import { darken } from '../../library/darken.ts';

import { Robot, type RobotProperties } from './robot.ts';

export type WallWalkingRobotProperties = RobotProperties & {
  turn: 'right' | 'left';
  color?: string;
  trails?: number;
  clearCell?: (cell: Cell) => void;
};

export class WallWalkingRobot extends Robot {
  private readonly turn: () => Direction[];
  private readonly color: string;
  private readonly trails: number;
  private readonly clearCell: (cell: Cell) => void;
  private readonly trail: Cell[] = [];

  public constructor({
    maze,
    turn,
    color = maze.avatarColor,
    trails = 0,
    clearCell,
    ...props
  }: WallWalkingRobotProperties) {
    super({ maze, ...props });

    this.turn =
      turn === 'right' ?
        () => this.maze.rightTurn(this.location)
      : () => this.maze.leftTurn(this.location);
    this.color = color;
    this.trails = trails;
    this.clearCell = clearCell ?? ((cell) => this.maze.drawCell(cell));
  }

  public execute(): void {
    this.clearCell(this.location);

    const moves = new Set(
      this.maze.moves(this.location, { wall: false }).map(({ direction }) => direction),
    );

    const direction = this.turn().find((d) => moves.has(d))!;
    this.location = this.maze.move(this.location, direction);

    this.clearCell(this.location);
    this.maze.drawAvatar(this.location, this.color);

    if (this.trails > 0) {
      while (this.trail.length > this.trails) {
        const cell = this.trail.pop()!;
        this.clearCell(cell);
      }

      for (let i = 0; i < this.trail.length; i++) {
        const cell = this.trail[i];
        this.clearCell(cell);
        this.maze.drawAvatar(cell, darken(this.color, (0.5 / this.trail.length) * (i + 1)));
      }

      this.trail.unshift(this.location);
    }

    this.history.push(this.location);
  }

  public override dispose(): void {
    if (this.trails > 0) {
      for (const cell of this.trail) {
        this.clearCell(cell);
      }
    } else {
      this.clearCell(this.history.at(-1)!);
    }
  }
}

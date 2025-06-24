import { type Cell, type Direction } from '../../geometry/maze.ts';

import { Robot, type RobotProperties } from './robot.ts';

export type BacktrackingRobotProperties = RobotProperties & {
  turn: 'right' | 'left';
  blocked: boolean[][];
  color?: string;
  clearCell?: (cell: Cell) => void;
};

export class BacktrackingRobot extends Robot {
  private readonly turn: () => Direction[];
  private readonly color: string;
  private readonly clearCell: (cell: Cell) => void;
  private readonly blocked: boolean[][];

  public constructor({
    maze,
    turn,
    blocked,
    color = maze.avatarColor,
    clearCell,
    ...props
  }: BacktrackingRobotProperties) {
    super({ maze, ...props });

    this.turn =
      turn === 'right' ?
        () => this.maze.rightTurn(this.location)
      : () => this.maze.leftTurn(this.location);
    this.color = color;
    this.blocked = blocked;
    this.clearCell = clearCell ?? ((cell) => this.maze.drawCell(cell));
  }

  public execute(): void {
    const previous = this.previousLocation();

    this.clearCell(this.location);
    const moves = new Set(
      this.maze
        .moves(this.location, { wall: false })
        .filter(({ move }) => !this.maze.isSame(move, previous) && !this.blocked[move.x][move.y])
        .map(({ direction }) => direction),
    );

    if (moves.size === 0) {
      this.maze.drawX(this.location);
      this.blocked[this.location.x][this.location.y] = true;
      this.location = previous!;
      this.clearCell(this.location);
      this.maze.drawAvatar(this.location, this.color);
      this.history.pop();
    } else {
      const direction = this.turn().find((d) => moves.has(d))!;
      this.location = this.maze.move(this.location, direction);
      this.clearCell(this.location);
      this.maze.drawAvatar(this.location, this.color);
      this.history.push(this.location);
    }
  }

  public override dispose(): void {
    this.clearCell(this.location);
  }
}

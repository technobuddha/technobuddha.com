import { create2DArray } from '@technobuddha/library';

import { type CellDirection, type Direction } from '../geometry/maze.ts';
import { darken } from '../library/darken.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

export type WallWalkingProperties = MazeSolverProperties & {
  turn?: 'right' | 'left';
  avatarColor?: string;
  pathColor?: string;
};

export class WallWalking extends MazeSolver {
  private readonly history: CellDirection[] = [];
  private readonly avatarColor: string;
  private readonly pathColor: string;
  private readonly forward: (cell: CellDirection) => Direction[];
  private readonly backward: (cell: CellDirection) => Direction[];

  public constructor({
    maze,
    avatarColor = maze.avatarColor,
    pathColor = maze.pathColor,
    ...props
  }: WallWalkingProperties) {
    super({ maze, ...props });

    this.avatarColor = avatarColor;
    this.pathColor = pathColor;

    const turn = props.turn ?? (this.random() < 0.5 ? 'left' : 'right');
    if (turn === 'right') {
      this.forward = this.maze.rightTurn.bind(this.maze);
      this.backward = this.maze.leftTurn.bind(this.maze);
    } else {
      this.forward = this.maze.leftTurn.bind(this.maze);
      this.backward = this.maze.rightTurn.bind(this.maze);
    }
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
    avatarColor = this.avatarColor,
    pathColor = this.pathColor,
  } = {}): AsyncIterator<void> {
    const trail: CellDirection[] = [];
    let seekingWall = true;

    let cell: CellDirection = {
      ...entrance,
      direction: this.maze.opposite(this.randomPick(Object.keys(this.maze.nexus(entrance).walls))!),
    };

    const cells: { visits: number; direction?: Direction }[][] = create2DArray(
      this.maze.width,
      this.maze.height,
      () => ({ visits: 0 }),
    );

    while (!this.maze.isSame(cell, exit)) {
      const v = ++cells[cell.x][cell.y].visits;
      if (v > Object.keys(this.maze.nexus(cell).walls).length) {
        throw new Error('Loop detected');
      }

      let dir: Direction | undefined;
      const moves = this.maze.moves(cell, { wall: false });

      if (seekingWall) {
        const wall = this.maze.nexus(cell).walls;
        const wallDirection = this.backward(cell).find((d) => wall[d]);
        if (wallDirection) {
          cell.direction = this.maze.opposite(this.maze.move(cell, wallDirection));
          dir = this.forward(cell).find((d) => moves.find((m) => m.direction === d))!;
          seekingWall = false;
        } else {
          dir = this.maze.straight(cell).find((d) => moves.find((m) => m.direction === d))!;
        }
      } else {
        dir = this.forward(cell).find((d) => moves.find((m) => m.direction === d))!;
      }

      if (trail.length > 15) {
        this.maze.drawCell(trail.shift()!);
      }

      trail.push(cell);
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];

        this.maze.drawAvatar(
          this.maze.drawCell(t),
          darken(pathColor, 1 - (1.25 / trail.length) * (i + 1)),
        );
      }

      const next = this.maze.move(cell, dir);

      this.maze.drawAvatar(this.maze.drawCell(next), avatarColor);
      yield;
      this.history.push(next);

      cells[cell.x][cell.y].direction = dir;
      cell = next!;
    }

    this.maze.solution = this.maze.makePath(entrance, this.maze.flatten(this.history));
  }
}

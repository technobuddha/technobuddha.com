import { create2DArray } from '@technobuddha/library';

import { type CellDirection, type Direction } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type WallWalkingProperties = MazeSolverProperties & {
  turn?: 'right' | 'left';
  avatarColor?: string;
  pathColor?: string;
};

export class WallWalking extends MazeSolver {
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

  public *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
    avatarColor = this.avatarColor,
    pathColor = this.pathColor,
  } = {}): Iterator<void> {
    let seekingWall = true;

    let cell: CellDirection = {
      ...entrance,
      direction: this.maze.opposite({
        ...entrance,
        direction: this.randomPick(Object.keys(this.maze.nexus(entrance).walls))!,
      }),
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

      const wall = this.maze.nexus(cell).walls;

      let dir: Direction | undefined;
      const moves = this.maze.validMoves(cell);

      if (seekingWall) {
        const wallDirection = this.backward(cell).find((d) => wall[d]);
        if (wallDirection) {
          cell.direction = this.maze.opposite(this.maze.move(cell, wallDirection)!);
          dir = this.forward(cell).find((d) => moves.find((m) => m.direction === d))!;
          seekingWall = false;
        } else {
          dir = this.maze.straight(cell).find((d) => moves.find((m) => m.direction === d))!;
        }
      } else {
        dir = this.forward(cell).find((d) => moves.find((m) => m.direction === d))!;
      }

      const next = this.maze.move(cell, dir)!;
      this.maze.drawPath(this.maze.drawCell({ ...cell, direction: dir }), pathColor);
      this.maze.drawAvatar(this.maze.drawCell(next), avatarColor);
      yield;

      cells[cell.x][cell.y].direction = dir;
      cell = next!;
    }

    cell = {
      x: entrance.x,
      y: entrance.y,
      direction: cells[entrance.x][entrance.y].direction!,
    };

    do {
      this.maze.solution.push(cell);
      const next = this.maze.move(cell, cell.direction)!;
      cell = { ...next, direction: cells[next.x][next.y].direction! };
    } while (!this.maze.isSame(cell, this.maze.exit));
  }
}

import { create2DArray } from '@technobuddha/library';

import { type CellDirection, type Direction } from '../maze/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type WallWalkingProperties = MazeSolverProperties & {
  turn?: 'right' | 'left';
};

export class WallWalking extends MazeSolver {
  private readonly forward: (cell: CellDirection) => Direction[];
  private readonly backward: (cell: CellDirection) => Direction[];

  public constructor(props: WallWalkingProperties) {
    super(props);

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
    solutionColor = this.solutionColor,
  } = {}): Iterator<void> {
    let seekingWall = true;
    this.maze.attachDrawing(this.drawing);

    let cell: CellDirection = {
      ...entrance,
      direction: this.maze.opposite({
        ...entrance,
        direction: this.randomPick(Object.keys(this.maze.walls[entrance.x][entrance.y]))!,
      }),
    };

    const cells: { visits: number; direction?: Direction }[][] = create2DArray(
      this.maze.width,
      this.maze.height,
      () => ({ visits: 0 }),
    );

    while (!this.maze.isSame(cell, exit)) {
      const v = ++cells[cell.x][cell.y].visits;
      const wall = this.maze.walls[cell.x][cell.y];

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
      this.maze.drawPath({ ...cell, direction: dir }, `rgba(255, 165, 0, ${(v + 1) * 0.25})`);
      yield;

      cells[cell.x][cell.y].direction = dir;
      cell = next!;
    }

    this.maze.clear();
    this.maze.drawDistances();

    cell = {
      x: entrance.x,
      y: entrance.y,
      direction: cells[entrance.x][entrance.y].direction!,
    };

    for (;;) {
      if (this.maze.isSame(cell, entrance)) {
        this.maze.drawCell(cell);
      } else if (this.maze.isSame(cell, exit)) {
        this.maze.drawCell(exit);
        this.maze.drawPath(exit, solutionColor);
        return;
      }

      this.maze.drawPath(cell, solutionColor);
      const next = this.maze.move(cell, cell.direction)!;
      cell = { ...next, direction: cells[next.x][next.y].direction! };
    }
  }
}

import { create2DArray } from '@technobuddha/library';

import { animate } from '../drawing/animate.ts';
import { type CellDirection, type Direction } from '../maze/maze.ts';

import { MazeSolver, type MazeSolverProperties, type SolveArguments } from './maze-solver.ts';

type WallWalkingProperties = MazeSolverProperties & {
  turn?: 'right' | 'left';
};

export class WallWalking extends MazeSolver {
  private readonly turn: (direction: Direction) => Direction[];

  public constructor(props: WallWalkingProperties) {
    super(props);

    if (props.turn === 'right') {
      this.turn = this.maze.rightTurn.bind(this.maze);
    } else if (props.turn === 'left') {
      this.turn = this.maze.leftTurn.bind(this.maze);
    } else {
      this.turn =
        this.random() < 0.0 ?
          this.maze.rightTurn.bind(this.maze)
        : this.maze.leftTurn.bind(this.maze);
    }
  }

  public async solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
    solutionColor = '#00FF00',
  }: SolveArguments = {}): Promise<void> {
    this.maze.prepareDrawing(this.drawing);

    let cell: CellDirection = {
      ...entrance,
      direction: this.maze.opposite(this.randomPick(this.maze.validMoves(entrance))!.direction),
    };

    const cells: { visits: number; direction?: Direction }[][] = create2DArray(
      this.maze.width,
      this.maze.height,
      () => ({ visits: 0 }),
    );

    while (cell.x !== exit.x || cell.y !== exit.y) {
      const v = ++cells[cell.x][cell.y].visits;

      const turns = this.turn(cell.direction);
      const moves = this.maze.validMoves(cell);
      const dir = turns.find((d) => moves.find((m) => m.direction === d))!;
      const next = this.maze.move(cell, dir)!;
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      await animate(() => {
        this.maze.drawPath({ ...cell, direction: dir }, `rgba(255, 165, 0, ${(v + 1) * 0.25})`);
      });
      // eslint-disable-next-line require-atomic-updates
      cells[cell.x][cell.y].direction = dir;
      cell = next!;
    }

    await animate(() => {
      this.maze.clear();
      this.maze.drawDistances();

      cell = {
        x: entrance.x,
        y: entrance.y,
        direction: cells[entrance.x][entrance.y].direction!,
      };

      for (;;) {
        if (cell.x === entrance.x && cell.y === entrance.y) {
          this.maze.drawCell(cell);
        } else if (cell.x === exit.x && cell.y === exit.y) {
          this.maze.drawCell(exit);
          this.maze.drawPath(exit, solutionColor);
          return;
        }

        this.maze.drawPath(cell, solutionColor);
        const next = this.maze.move(cell, cell.direction)!;
        cell = { ...next, direction: cells[next.x][next.y].direction! };
      }
    });
  }
}

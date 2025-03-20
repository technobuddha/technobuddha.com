import { create2DArray } from '@technobuddha/library';

import { type CellDirection, type Direction } from '../maze/maze.js';

import { type MazeSolverProperties, type SolveArguments } from './maze-solver.js';
import { MazeSolver } from './maze-solver.js';

type WallWalkingProperties = MazeSolverProperties & {
  turn?: 'right' | 'left';
};

export class WallWalking extends MazeSolver {
  private readonly turn: (direction: Direction) => Direction[];

  public constructor(props: WallWalkingProperties) {
    super(props);

    if (props.turn === 'right') {
      this.turn = this.maze.rightTurn.bind(this);
    } else if (props.turn === 'left') {
      this.turn = this.maze.leftTurn.bind(this);
    } else {
      this.turn =
        Math.random() < 0.0 ? this.maze.rightTurn.bind(this) : this.maze.leftTurn.bind(this);
    }
  }

  public async solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  }: SolveArguments = {}): Promise<void> {
    this.maze.prepareContext(this.context);

    return new Promise<void>((resolve) => {
      let cell: CellDirection = {
        x: entrance.x,
        y: entrance.y,
        direction: this.maze.opposite(entrance.direction),
      };

      const cells: { visits: number; direction?: Direction }[][] = create2DArray(
        this.maze.width,
        this.maze.height,
        () => ({ visits: 0 }),
      );

      const go = (): void => {
        requestAnimationFrame(() => {
          const v = ++cells[cell.x][cell.y].visits;
          if (cell.x === exit.x && cell.y === exit.y) {
            this.maze.clear();
            cell = {
              x: entrance.x,
              y: entrance.y,
              direction: cells[entrance.x][entrance.y].direction!,
            };

            for (;;) {
              if (cell.x !== exit.x || cell.y !== exit.y) {
                const next = this.maze.move(cell, cell.direction)!;
                this.maze.drawPath(cell, 'yellow');
                cell = { ...next, direction: cells[next.x][next.y].direction! };
              } else {
                this.maze.drawPath(exit, 'yellow');
                resolve();
                break;
              }
            }
          } else {
            const turns = this.turn(cell.direction);
            const moves = this.maze.validMoves(cell);
            const dir = turns.find((d) => moves.find((m) => m.direction === d))!;
            const next = this.maze.move(cell, dir)!;
            this.maze.drawPath({ ...cell, direction: dir }, `rgba(255, 255, 0, ${(v + 1) * 0.25})`);
            cells[cell.x][cell.y].direction = dir;
            cell = next;
            go();
          }
        });
      };
      go();
    });
  }
}

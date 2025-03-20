import create2DArray from '@technobuddha/library/create2DArray';
import type { CellDirection, Direction } from '../maze/maze';

import { MazeSolver } from './maze-solver';
import type { MazeSolverProperties, SolveArguments } from './maze-solver';

export class WallWalking extends MazeSolver {
  private readonly turn: (direction: Direction) => Direction[];

  constructor(props: MazeSolverProperties) {
    super(props);

    this.turn =
      Math.random() < 0.5 ? this.maze.rightTurn.bind(this) : this.maze.leftTurn.bind(this);
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
      let cells: { visits: number; direction?: Direction }[][] = create2DArray(
        this.maze.width,
        this.maze.height,
        () => ({ visits: 0 }),
      );

      const go = () => {
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
            const dir = turns.find((d) => this.maze.walls[cell.x][cell.y][d] === false)!;
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

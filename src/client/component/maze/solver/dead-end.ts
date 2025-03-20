import { animate } from '../drawing/animate.js';
import { type CellDirection } from '../maze/maze.js';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.js';

type DeadEndProperties = MazeSolverProperties & {
  method?: 'fill' | 'remove';
};

export class DeadEnd extends MazeSolver {
  protected method: DeadEndProperties['method'];

  public constructor({ method = 'fill', ...props }: DeadEndProperties) {
    super(props);
    this.method = method;
  }

  public async solve(): Promise<void> {
    const walls = this.maze.cloneWalls();
    this.maze.prepareDrawing(this.context);

    let deadEnds = this.randomShuffle(this.maze.deadEnds({ walls }));
    while (deadEnds.length > 0) {
      for (const deadEnd of deadEnds) {
        if (this.method === 'fill') {
          for (let cell = deadEnd; this.maze.isDeadEnd(cell, { walls }); ) {
            const [move] = this.maze.validMoves(cell, { walls });

            await animate(() => {
              this.maze.addWall(cell, move.direction, { walls }, false);
              // this.maze.drawCell(cell, this.maze.cellColor, this.maze.wallColor, { walls });
              this.maze.drawX(cell, 'red');
            });
            // eslint-disable-next-line require-atomic-updates
            cell = { x: move.x, y: move.y };
          }
        } else {
          await animate(() => {
            const moves = this.maze.validMoves(deadEnd, { walls });

            for (const move of moves) {
              this.maze.addWall(deadEnd, move.direction, { walls }, false);
            }

            this.maze.drawX(deadEnd, 'pink');
          });
        }
      }
      deadEnds = this.randomShuffle(this.maze.deadEnds({ walls }));
    }

    this.maze.clear();
    this.maze.drawDistances();

    let cell = {
      ...this.maze.entrance,
      direction: this.maze.opposite(this.maze.entrance.direction),
    };
    const path: CellDirection[] = [cell];
    while (cell.x !== this.maze.exit.x || cell.y !== this.maze.exit.y) {
      const [move] = this.maze
        .validMoves(cell, { walls })
        .filter((m) => !path.some((p) => p.x === m.x && p.y === m.y));
      this.maze.drawPath({ ...cell, direction: move.direction });
      path.push(cell);
      cell = move;
    }

    this.maze.drawPath(this.maze.exit);
  }
}

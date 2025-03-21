import { animate } from '../drawing/animate.ts';
import { type CellDirection } from '../maze/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type DeadEndProperties = MazeSolverProperties & {
  method?: 'cul-de-sac' | 'dead-end';
};

export class Filler extends MazeSolver {
  protected method: DeadEndProperties['method'];

  public constructor({ method = 'cul-de-sac', ...props }: DeadEndProperties) {
    super(props);
    this.method = method;
  }

  public async solve({ solutionColor = '#00FF00' }): Promise<void> {
    const walls = this.maze.cloneWalls();
    this.maze.prepareDrawing(this.drawing);

    let deadEnds = this.randomShuffle(this.maze.deadEnds({ walls }));
    while (deadEnds.length > 0) {
      for (const deadEnd of deadEnds) {
        if (this.method === 'cul-de-sac') {
          for (let cell = deadEnd; this.maze.isDeadEnd(cell, { walls }); ) {
            const [move] = this.maze.validMoves(cell, { walls });

            await animate(() => {
              this.maze.addWall(cell, move.direction, { walls }, false);
              this.maze.drawX(cell);
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

            this.maze.drawX(deadEnd);
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

    this.maze.drawCell(this.maze.exit);
    this.maze.drawPath(this.maze.exit, solutionColor);
  }
}

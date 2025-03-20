import { animate } from '../util/animate.js';

import { MazeSolver } from './maze-solver.js';

export class DeadEndRemover extends MazeSolver {
  public async solve(): Promise<void> {
    const walls = this.maze.cloneWalls();

    this.maze.prepareContext(this.context);
    for (;;) {
      const deadEnds = this.randomShuffle(this.maze.deadEnds({ walls }));
      if (deadEnds.length === 0) {
        return;
      }

      for (const cell of deadEnds) {
        await animate(() => {
          const moves = this.maze.validMoves(cell, { walls });

          for (const move of moves) {
            this.maze.addWall(cell, move.direction, { walls });

            const cell2 = this.maze.move(cell, move.direction);
            if (cell2 && this.maze.inMaze(cell2)) {
              this.maze.addWall(cell2, this.maze.opposite(move.direction), { walls });
            }
          }

          // this.maze.drawCell(cell, this.maze.wallColor);
          this.maze.drawX(cell, 'pink');
        });
      }
    }
  }
}

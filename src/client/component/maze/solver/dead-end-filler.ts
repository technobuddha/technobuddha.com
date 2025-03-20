import { randomShuffle } from '@technobuddha/library';

import { animate } from '../util/animate.js';

import { MazeSolver } from './maze-solver.js';

export class DeadEndFiller extends MazeSolver {
  public async solve(): Promise<void> {
    const walls = this.maze.cloneWalls();

    this.maze.prepareContext(this.context);

    const deadEnds = randomShuffle(this.maze.deadEnds());
    // for (const end of deadEnds) {
    //   this.maze.drawX(end, 'red');
    // }

    for (const deadEnd of deadEnds) {
      for (let cell = deadEnd; this.maze.isDeadEnd(cell, { walls }); ) {
        const [move] = this.maze.validMoves(cell, { walls });

        await animate(() => {
          this.maze.addWall(cell, move.direction, { walls });
          this.maze.drawX(cell, 'red');
        });
        // eslint-disable-next-line require-atomic-updates
        cell = { x: move.x, y: move.y };
      }
    }
  }
}

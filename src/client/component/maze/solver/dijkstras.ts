import { create2DArray } from '@technobuddha/library';

import { animate } from '../drawing/animate.ts';
import { type Cell, type Direction } from '../maze/maze.ts';

import { MazeSolver } from './maze-solver.ts';

type DD = {
  dir?: Direction;
  dist: number;
};

export class Dijkstras extends MazeSolver {
  public async solve({
    color = 'gold',
    solutionColor = '#00FF00',
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): Promise<void> {
    const queue: Cell[] = [];
    const distances = create2DArray<DD>(this.maze.width, this.maze.height, () => ({
      dist: Infinity,
    }));
    distances[entrance.x][entrance.y] = { dist: 0 };
    queue.unshift(entrance);
    this.maze.drawCell(entrance, color);

    while (queue.length > 0) {
      for (let i = 0; i < 10 && queue.length > 0; i++) {
        const cell = queue.pop()!;

        if (cell.x === exit.x && cell.y === exit.y) {
          queue.length = 0;
        } else {
          const distance = distances[cell.x][cell.y].dist + 1;
          const neighbors = this.randomShuffle(
            this.maze.validMoves(cell).filter((n) => distances[n.x][n.y].dist > distance),
          );

          for (const neighbor of neighbors) {
            distances[neighbor.x][neighbor.y] = { dir: neighbor.direction, dist: distance };
            await animate(() => {
              this.maze.drawCell(neighbor, color);
            });
            queue.unshift(neighbor);
          }
        }
      }
    }

    await animate(() => {
      this.maze.draw();
      this.maze.drawDistances();

      let cell = { ...exit, direction: this.maze.opposite(exit.direction) };

      const dist = distances[cell.x]?.[cell.y];
      if (!dist || dist.dist === Infinity) {
        // eslint-disable-next-line no-console
        console.log('no solution found', dist);
      } else {
        for (;;) {
          this.maze.drawPath(
            { ...cell, direction: this.maze.opposite(cell.direction) },
            solutionColor,
          );
          if (cell.x === entrance.x && cell.y === entrance.y) {
            break;
          }
          cell = this.maze.move(cell, this.maze.opposite(distances[cell.x][cell.y].dir!))!;
        }
      }

      this.maze.drawCell(exit);
      this.maze.drawPath(exit, solutionColor);
    });
  }
}

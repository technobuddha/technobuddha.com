import { create2DArray } from '@technobuddha/library';

import { type Cell, type Direction } from '../maze/maze.js';
import { animate } from '../util/animate.js';

import { type SolveArguments } from './maze-solver.js';
import { MazeSolver } from './maze-solver.js';

type DD = {
  dir?: Direction;
  dist: number;
};

export class BreadthFirstSearch extends MazeSolver {
  public async solve({
    color = 'lime',
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  }: SolveArguments = {}): Promise<void> {
    const queue: Cell[] = [];
    const distances = create2DArray<DD>(this.maze.width, this.maze.height, () => ({
      dist: Infinity,
    }));
    distances[entrance.x][entrance.y] = { dist: 0 };
    queue.unshift(entrance);
    this.maze.drawCell(entrance, color);

    for (const direction of this.maze.directions) {
      if (!this.maze.walls[entrance.x][entrance.y][direction]) {
        this.maze.drawWall({ ...entrance, direction }, color);
      }
    }

    while (queue.length > 0) {
      await animate(() => {
        for (let i = 0; i < 3 && queue.length > 0; i++) {
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
              this.maze.drawCell(neighbor, color);
              for (const direction of this.maze.directions) {
                if (this.maze.walls[neighbor.x][neighbor.y][direction] === false) {
                  this.maze.drawWall({ ...neighbor, direction }, color);
                }
              }
              queue.unshift(neighbor);
            }
          }
        }
      });
    }

    this.maze.draw();

    let cell = { ...exit, direction: this.maze.opposite(exit.direction) };

    const dist = distances[cell.x]?.[cell.y];
    if (!dist || dist.dist === Infinity) {
      // eslint-disable-next-line no-console
      console.log('no solution found', dist);
    } else {
      for (;;) {
        this.maze.drawPath({ ...cell, direction: this.maze.opposite(cell.direction) }, color);
        if (cell.x === entrance.x && cell.y === entrance.y) {
          break;
        }
        cell = this.maze.move(cell, this.maze.opposite(distances[cell.x][cell.y].dir!))!;
      }
    }
  }
}

import { create2DArray } from '@technobuddha/library';

import { type Cell, type Direction } from '../maze/maze.ts';

import { MazeSolver } from './maze-solver.ts';

type DD = {
  dir?: Direction;
  dist: number;
};

export class Dijkstras extends MazeSolver {
  public *solve({
    color = 'gold',
    solutionColor = '#00FF00',
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): Iterator<void> {
    const queue: Cell[] = [];
    const distances = create2DArray<DD>(this.maze.width, this.maze.height, () => ({
      dist: Infinity,
    }));
    distances[entrance.x][entrance.y] = { dist: 0 };
    queue.unshift(entrance);
    this.maze.drawCell(entrance, color);

    while (queue.length > 0) {
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
          yield;
          queue.unshift(neighbor);
        }
      }
    }

    this.maze.draw();
    this.maze.drawDistances();

    let cell = { ...exit, direction: this.maze.opposite(exit) };

    const dist = distances[cell.x]?.[cell.y];
    if (!dist || dist.dist === Infinity) {
      // eslint-disable-next-line no-console
      console.log('no solution found', dist);
    } else {
      for (;;) {
        this.maze.drawPath({ ...cell, direction: this.maze.opposite(cell) }, solutionColor);
        if (cell.x === entrance.x && cell.y === entrance.y) {
          break;
        }
        cell = this.maze.move(
          cell,
          this.maze.opposite({ ...cell, direction: distances[cell.x][cell.y].dir! }),
        )!;
      }
    }

    this.maze.drawCell(exit);
    this.maze.drawPath(exit, solutionColor);
  }
}

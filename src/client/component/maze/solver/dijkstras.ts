import { create2DArray } from '@technobuddha/library';

import { type Cell, type Direction } from '../maze/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type DirectionDistance = {
  dir?: Direction;
  dist: number;
};

type DijkstrasProperties = MazeSolverProperties & {
  scannedColor?: string;
};

export class Dijkstras extends MazeSolver {
  public scannedColor: string;

  public constructor({ scannedColor = '#A4036F', ...props }: DijkstrasProperties) {
    super(props);
    this.scannedColor = scannedColor;
  }

  public *solve({
    color = '#A4036F', //'#F6DB7E',
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): Iterator<void> {
    const queue: Cell[] = [];
    const distances = create2DArray<DirectionDistance>(this.maze.width, this.maze.height, () => ({
      dist: Infinity,
    }));
    distances[entrance.x][entrance.y].dist = 0;

    queue.unshift(entrance);
    this.maze.drawAvatar(entrance);

    while (queue.length > 0) {
      const cell = queue.pop()!;

      if (this.maze.isSame(cell, exit)) {
        queue.length = 0;
      } else {
        const distance = distances[cell.x][cell.y].dist + 1;
        const neighbors = this.randomShuffle(
          this.maze.validMoves(cell).filter((n) => distances[n.x][n.y].dist > distance),
        );

        if (neighbors.length > 0) {
          for (const neighbor of neighbors) {
            distances[neighbor.x][neighbor.y] = { dir: neighbor.direction, dist: distance };
            this.maze.drawCell(cell, color);
            this.maze.drawAvatar(neighbor);
            yield;
            queue.unshift(neighbor);
          }
        } else {
          yield this.maze.drawCell(cell, color);
        }
      }
    }

    let cell = { ...exit, direction: this.maze.opposite(exit) };

    const dist = distances[cell.x][cell.y];
    if (!dist || dist.dist === Infinity) {
      throw new Error('No solution found');
    } else {
      for (;;) {
        this.maze.solution.push({ ...cell, direction: this.maze.opposite(cell) });
        if (this.maze.isSame(cell, entrance)) {
          break;
        }
        cell = this.maze.move(
          cell,
          this.maze.opposite({ ...cell, direction: distances[cell.x][cell.y].dir! }),
        )!;
      }
    }
  }
}

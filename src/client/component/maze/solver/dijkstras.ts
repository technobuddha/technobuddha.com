import { create2DArray } from '@technobuddha/library';

import { type Cell, type Direction } from '../maze/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type DirectionDistance = {
  dir?: Direction;
  dist: number;
};

type DijkstrasProperties = MazeSolverProperties & {
  scannedColor?: string;
  avatarColor?: string;
};

export class Dijkstras extends MazeSolver {
  public scannedColor: string;
  public avatarColor: string;

  public constructor({
    scannedColor = '#DC0073',
    avatarColor = '#08A4BD',
    ...props
  }: DijkstrasProperties) {
    super({ speed: 3, ...props });
    this.scannedColor = scannedColor;
    this.avatarColor = avatarColor;
  }

  public *solve({
    avatarColor = this.avatarColor,
    scannedColor = this.scannedColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): Iterator<void> {
    const queue: Cell[] = [];
    const distances = create2DArray<DirectionDistance>(this.maze.width, this.maze.height, () => ({
      dist: Infinity,
    }));
    distances[entrance.x][entrance.y].dist = 0;

    queue.unshift(entrance);
    this.maze.drawAvatar(this.maze.drawCell(entrance), avatarColor);

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
            this.maze.drawCell(cell, scannedColor);
            this.maze.drawAvatar(this.maze.drawCell(neighbor), avatarColor);
            yield;
            queue.unshift(neighbor);
          }
        } else {
          this.maze.drawCell(cell, scannedColor);
          yield;
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

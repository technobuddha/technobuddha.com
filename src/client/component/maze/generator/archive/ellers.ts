import { create2DArray } from '@technobuddha/library';
import { range } from 'lodash-es';

import { type Cell } from '../../geometry/maze.ts';

import { type MazeGeneratorProperties } from '../maze-generator.ts';
import { MazeGenerator } from '../maze-generator.ts';

export class Ellers extends MazeGenerator {
  private setNumber = 0;
  private readonly set: (number | null)[][];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = { x: 0, y: 0 };
    this.set = create2DArray<number | null>(this.maze.width, this.maze.height, null);
  }

  private merge(main: number | null, x: number, y: number): void {
    if (main === null) {
      throw new Error('main is null');
    } else if (this.set[x][y] === null) {
      this.set[x][y] = main;
      // this.maze.drawText({ x: x, y: y }, main.toString(), 'red');
    } else {
      const other = this.set[x][y];

      for (let yy = 0; yy < this.maze.height; yy++) {
        for (let xx = 0; xx < this.maze.width; xx++) {
          if (this.set[xx][yy] === other) {
            this.set[xx][yy] = main;
            // this.maze.drawCell({ x: xx, y: yy });
            // this.maze.drawText({ x: xx, y: yy }, main.toString(), 'cyan');
          } else if (this.set[xx][yy] !== null) {
            // this.maze.drawCell({ x: xx, y: yy });
            // this.maze.drawText({ x: xx, y: yy }, this.set[xx][yy]!.toString(), 'lime');
          }
        }
      }
    }
  }

  public *generate(): Generator<void> {
    this.currentCell = { x: 0, y: 0 };

    for (this.currentCell.y = 0; this.currentCell.y < this.maze.height; this.currentCell.y++) {
      const lastRow = this.currentCell.y === this.maze.height - 1;

      for (this.currentCell.x = 0; this.currentCell.x < this.maze.width; this.currentCell.x++) {
        if (this.set[this.currentCell.x][this.currentCell.y] === null) {
          const mySet = this.setNumber++;

          this.set[this.currentCell.x][this.currentCell.y] = mySet;
          // this.maze.drawText(this.currentCell, mySet.toString(), 'magenta');
        }
      }

      // horizontal mode
      for (this.currentCell.x = 0; this.currentCell.x < this.maze.width; this.currentCell.x++) {
        const currentSet = this.set[this.currentCell.x][this.currentCell.y];

        if (this.random() < 0.5 || lastRow) {
          const next = this.randomPick(
            this.maze
              .neighbors(this.currentCell)
              .filter(
                ({ x, y }) =>
                  x >= this.currentCell.x &&
                  y === this.currentCell.y &&
                  currentSet !== this.set[x][y],
              ),
          );

          if (next) {
            this.maze.removeWall(this.currentCell, next.direction);
            this.merge(currentSet, next.x, next.y);
            yield;
          }
        }
      }

      if (!lastRow) {
        for (const set of new Set(
          range(0, this.maze.width).map((x) => this.set[x][this.currentCell.y]),
        )) {
          const members: Cell[] = range(0, this.maze.width)
            .filter((x) => this.set[x][this.currentCell.y] === set)
            .map((x) => ({ x, y: this.currentCell.y }));

          do {
            const index = Math.floor(this.random() * members.length);
            const cell = members[index];

            const next = this.randomPick(
              this.maze
                .neighbors(cell)
                .filter(
                  ({ x, y, direction }) =>
                    direction === 'e' && y === cell.y + 1 && this.set[x][y] === null,
                ),
            );
            if (next) {
              this.maze.removeWall(cell, next.direction);
              this.merge(set, next.x, next.y);
              yield;
            }

            members.splice(index, 1);
          } while (members.length > 0 && this.random() < 0.5);
        }
      }
    }
  }
}

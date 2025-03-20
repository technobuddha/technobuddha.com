import { create2DArray, randomPick, randomShuffle } from '@technobuddha/library';
import { range, uniqBy } from 'lodash-es';

import { type Cell, type CellDirection } from '../../maze/maze.js';

import { type MazeGeneratorProperties } from '../maze-generator.js';
import { MazeGenerator } from '../maze-generator.js';

type Mode = 'horizontal' | 'vertical';
type Group = {
  set: number;
  downs: { from: Cell; to: CellDirection }[];
};

export class Ellers extends MazeGenerator {
  private mode: Mode;
  private readonly set: (number | null)[][];

  private groups: Group[] = [];

  public constructor(props: MazeGeneratorProperties) {
    super(props);

    this.currentCell = { x: 0, y: 0 };

    this.set = create2DArray(this.maze.width, this.maze.height, (x, y) => x + y * this.maze.width);

    this.mode = 'horizontal';
    this.currentCell = { x: 0, y: 0 };
  }

  private merge(main: number | null, other: number | null): void {
    if (main === null || other === null) {
      throw new Error('merge of null');
    } else {
      for (let y = 0; y < this.maze.height; y++) {
        for (let x = 0; x < this.maze.width; x++) {
          if (this.set[x][y] === other) {
            this.set[x][y] = main;
          }
        }
      }
    }
  }

  public override step(): boolean {
    return this.mode === 'horizontal' ? this.horizontalStep() : this.verticalStep();
  }

  private horizontalStep(): boolean {
    const currentSet = this.set[this.currentCell.x][this.currentCell.y];

    if (this.random() < 0.5 || this.currentCell.y === this.maze.height - 1) {
      const next = randomPick(
        this.maze
          .neighbors(this.currentCell)
          .filter(
            ({ x, y }) =>
              x >= this.currentCell.x && y === this.currentCell.y && currentSet !== this.set[x][y],
          ),
        this.random,
      );
      if (next) {
        this.maze.removeWall(this.currentCell, next.direction);
        this.merge(currentSet, this.set[next.x][next.y]);
      }
    }

    this.currentCell.x++;
    if (this.currentCell.x >= this.maze.width) {
      const sets = new Set(range(0, this.maze.width).map((x) => this.set[x][this.currentCell.y]!));
      this.groups = Array.from(sets).map((set) => {
        const members = range(0, this.maze.width).filter(
          (x) => this.set[x][this.currentCell.y] === set,
        );
        let downs = uniqBy(
          members.flatMap((x) =>
            this.maze
              .neighbors({ x, y: this.currentCell.y })
              .filter(({ y }) => y > this.currentCell.y)
              .map((n) => ({
                from: { x, y: this.currentCell.y },
                to: n,
              })),
          ),
          (c) => c.to.x + c.from.y * this.maze.width,
        );

        if (downs.length > 1) {
          const numberOfDowns = Math.floor(this.random() * (downs.length - 1) + 1);
          downs = randomShuffle(downs, this.random).slice(0, numberOfDowns);
        }

        return { set, downs };
      });

      this.mode = 'vertical';
      this.currentCell.x = 0;
      this.currentCell.y++;
      return this.currentCell.y < this.maze.height;
    }

    return true;
  }

  private verticalStep(): boolean {
    if (this.groups.length === 0) {
      this.mode = 'horizontal';
      return true;
    }

    const group = this.groups.at(0)!;
    const down = group.downs.pop()!;

    this.maze.removeWall(down.from, down.to.direction);
    this.merge(group.set, this.set[down.to.x][down.to.y]);

    if (group.downs.length === 0) {
      this.groups.shift();
    }
    return true;
  }
}

import { create2dArray } from '@technobuddha/library';

import { type Cell, type CellFacing } from '../../geometry/index.ts';

import { Robot, type RobotProperties } from './robot.ts';

type Journal = {
  parent?: CellFacing;
  distance: number;
  children?: number;
};

type Queue = {
  cell: CellFacing;
  distance: number;
  parent?: CellFacing;
};

export type DijkstrasRobotProperties = Omit<RobotProperties, 'program' | 'showPath'> & {
  readonly showMarks?: boolean;
  readonly scannedColor?: string;
  readonly prunedColor?: string;
  readonly avatarColor?: string;
};

export class DijkstrasRobot extends Robot {
  public readonly algorithm = 'dijkstras';
  public readonly showMarks: boolean;
  public readonly scannedColor: string;
  public readonly prunedColor: string;
  public readonly avatarColor: string;

  protected readonly queue: Queue[];
  protected readonly journal: Journal[][];
  protected readonly scanned: boolean[][];

  public constructor({
    maze,
    showMarks = false,
    scannedColor = maze.color.scanned,
    avatarColor = maze.color.avatar,
    prunedColor = maze.color.pruned,
    ...props
  }: DijkstrasRobotProperties) {
    super({ maze, program: 'random', ...props });
    this.showMarks = showMarks;
    this.scannedColor = scannedColor;
    this.avatarColor = avatarColor;
    this.prunedColor = prunedColor;

    this.scanned = create2dArray<boolean>(maze.width, maze.height, false);
    this.journal = create2dArray<Journal>(this.maze.width, this.maze.height, () => ({
      distance: Infinity,
    }));

    this.scanned[this.maze.entrance.x][this.maze.entrance.y] = true;
    this.queue = [{ cell: this.maze.entrance, distance: 0 }];
  }

  public override get name(): string {
    return this.algorithm;
  }

  protected override redrawCell(cell: Cell, color?: string): void {
    const journal = this.journal[cell.x][cell.y];
    const children = journal.children ?? 0;

    super.redrawCell(cell, this.showMarks && children <= 0 ? this.prunedColor : color);
    if (this.showMarks && journal.distance !== Infinity && children > 0) {
      this.maze.drawDot(cell, this.scannedColor);
    }
  }

  public execute(): void {
    const q = this.queue.pop();
    if (q) {
      const { cell, distance, parent } = q;

      const validMoves = this.randomShuffle(
        this.maze
          .moves(cell, { wall: false })
          .filter(({ target }) => !this.scanned[target.x][target.y]),
      );

      this.journal[cell.x][cell.y].parent = parent;
      this.journal[cell.x][cell.y].distance = distance;
      this.journal[cell.x][cell.y].children = validMoves.length;
      this.moveTo(cell);

      if (validMoves.length > 0) {
        for (const validMove of validMoves) {
          this.scanned[validMove.target.x][validMove.target.y] = true;
          this.queue.unshift({ cell: validMove.target, distance: distance + 1, parent: cell });
        }
      } else if (!this.maze.isSame(cell, this.maze.exit)) {
        let parent = cell;
        while (parent) {
          this.journal[parent.x][parent.y].children ??= 0;
          this.journal[parent.x][parent.y].children!--;

          if (this.journal[parent.x][parent.y].children! <= 0) {
            if (!this.maze.isSame(parent, cell)) {
              this.redrawCell(parent);
            }
            parent = this.journal[parent.x][parent.y].parent!;
          } else {
            break;
          }
        }
      }
    }
  }

  public override path(): CellFacing[] {
    let cell = this.maze.exit;
    const path: CellFacing[] = [cell];

    for (
      let dist = this.journal[cell.x][cell.y];
      dist.parent;
      dist = this.journal[dist.parent.x][dist.parent.y]
    ) {
      cell = dist.parent;
      path.unshift(cell);
    }

    return path;
  }
}

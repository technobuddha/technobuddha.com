import { create2DArray } from '@technobuddha/library';

import {
  type Cell,
  type CellDirection,
  type CellFacing,
  type Direction,
  type Move,
} from '../../geometry/maze.ts';
import { alpha } from '../../library/alpha.ts';

import { Robot, type RobotProperties } from './robot.ts';

export type TremauxRobotProperties = RobotProperties & {
  showMarks?: boolean;
  color?: string;
  pathColor?: string;
  blockedColor?: string;
};

export class TremauxRobot extends Robot {
  protected readonly showMarks: boolean = true;
  protected readonly avatarColor: string;
  protected readonly markedColor: string;
  protected readonly blockedColor: string;
  protected prev: Cell | undefined = undefined;
  protected readonly marks: Record<Direction, number>[][];

  public constructor({
    maze,
    showMarks = true,
    color = maze.avatarColor,
    pathColor = maze.pathColor,
    blockedColor = maze.blockedColor,
    ...props
  }: TremauxRobotProperties) {
    super({ maze, ...props });
    this.showMarks = showMarks;
    this.avatarColor = color;
    this.markedColor = alpha(pathColor, 0.5);
    this.blockedColor = alpha(blockedColor, 0.5);

    this.marks = create2DArray(
      this.maze.width,
      this.maze.height,
      (x, y) =>
        Object.fromEntries(
          Object.entries(this.maze.nexus({ x: x, y: y }).walls).map(([k]) => [k as Direction, 0]),
        ) as Record<Direction, number>,
    );
  }

  private drawMark(cell: CellDirection): void {
    if (this.showMarks) {
      const m = this.marks[cell.x][cell.y][cell.direction];
      if (m === 1) {
        this.maze.drawWall(cell, this.markedColor);
      } else if (m >= 2) {
        this.maze.drawWall(cell, this.blockedColor);
      }
    }
  }

  protected move(next: Move): void {
    this.marks[this.location.x][this.location.y][next.direction]++;
    this.marks[next.move.x][next.move.y][this.maze.opposite(next.move.facing)]++;

    this.clearCell(this.location);
    for (const direction of Object.keys(
      this.marks[this.location.x][this.location.y],
    ) as Direction[]) {
      this.drawMark({ ...this.location, direction });
    }

    for (const direction of Object.keys(this.marks[next.move.x][next.move.y]) as Direction[]) {
      this.drawMark({ ...next.move, direction });
    }

    this.prev = this.location;
    this.moveTo(next.move);
  }

  public execute(): void {
    const moves = this.maze.moves(this.location, { wall: false });

    const pmi = moves.findIndex(({ move }) => this.maze.isSame(move, this.prev));
    const prevMove = pmi >= 0 ? moves[pmi] : undefined;

    if (pmi >= 0) {
      moves.splice(pmi, 1);
    }

    const marks = this.marks[this.location.x][this.location.y];

    if (moves.length > 0 && moves.every((m) => marks[m.direction] === 0)) {
      // 1. If only the entrance you just came from is marked, pick an arbitrary unmarked
      //    entrance, if any. This rule also applies if you're just starting in the middle
      //    of the maze and there are no marked entrances at all.
      const next = this.randomPick(moves)!;
      //           //this.marks[next.x][next.y]++;
      this.move(next);
    } else if (
      prevMove &&
      moves.every((m) => marks[m.direction] === 1) &&
      marks[prevMove.direction] < 2
    ) {
      // 2. If all entrances are marked, go back through the entrance you just came from,
      //    unless it is marked twice. This rule will apply whenever you reach a dead end.
      this.move(prevMove);
      // 3. Pick any entrance with the fewest marks (zero if possible, else one).
    } else if (moves.length === 0) {
      if (prevMove) {
        this.move(prevMove);
      } else {
        // eslint-disable-next-line no-debugger
        debugger;
        throw new Error('No moves found for tremaux');
      }
    } else {
      const [next] = this.randomShuffle(moves).sort(
        (a, b) => marks[a.direction] - marks[b.direction],
      );

      this.move(next);
    }
  }

  public override path(): CellFacing[] {
    let curr: CellFacing = this.start;
    let prev: CellFacing | undefined = undefined;

    const path: CellFacing[] = [curr];
    while (!this.maze.isSame(curr, this.location)) {
      const [next] = this.maze.moves(curr, { wall: false }).filter(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (move) =>
          !this.maze.isSame(move.move, prev) && this.marks[curr.x][curr.y][move.direction] === 1,
      );

      if (next) {
        prev = curr;
        curr = next.move;
        path.push(curr);
      } else {
        throw new Error('No solution found for tremaux');
      }
    }

    return path;
  }
}

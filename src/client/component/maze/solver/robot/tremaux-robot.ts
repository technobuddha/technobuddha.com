import { create2DArray } from '@technobuddha/library';

import { type Cell, type CellFacing, type Direction, type Move } from '../../geometry/index.ts';
import { darken } from '../../library/darken.ts';

import { Robot, type RobotProperties } from './robot.ts';
import { RobotError } from './robot-error.ts';

export type TremauxRobotProperties = RobotProperties & {
  showMarks?: boolean;
  pathColor?: string;
  blockedColor?: string;
};

export class TremauxRobot extends Robot {
  protected readonly showMarks: boolean = true;
  protected readonly markedColor: string;
  protected readonly blockedColor: string;
  protected readonly marks: Record<Direction, number>[][];

  public constructor({
    maze,
    showMarks = true,
    pathColor = maze.pathColor,
    blockedColor = maze.blockedColor,
    ...props
  }: TremauxRobotProperties) {
    super({ maze, ...props });
    this.showMarks = showMarks;
    this.markedColor = darken(pathColor, 0.15);
    this.blockedColor = darken(blockedColor, 0.15);

    this.marks = create2DArray(
      this.maze.width,
      this.maze.height,
      (x, y) =>
        Object.fromEntries(
          Object.entries(this.maze.nexus({ x: x, y: y }).walls).map(([k]) => [k as Direction, 0]),
        ) as Record<Direction, number>,
    );
  }

  private drawMark(cell: Cell, direction: Direction): void {
    if (this.showMarks) {
      const m = this.marks[cell.x][cell.y][direction];
      this.maze.drawWall({ ...cell, direction }, m === 1 ? this.markedColor : this.blockedColor);
    }
  }

  protected move(next: Move): void {
    this.marks[this.location.x][this.location.y][next.direction]++;
    this.marks[next.target.x][next.target.y][this.maze.opposite(next.target.facing)]++;

    this.clearCell(this.location);
    this.moveTo(next.target);

    for (const direction of Object.keys(
      this.marks[this.previous.x][this.previous.y],
    ) as Direction[]) {
      this.drawMark(this.previous, direction);
    }

    for (const direction of Object.keys(
      this.marks[this.location.x][this.location.y],
    ) as Direction[]) {
      this.drawMark(this.location, direction);
    }
  }

  public step(): void {
    const moves = this.maze.moves(this.location, { wall: false });

    const pmi = moves.findIndex(({ target }) => this.maze.isSame(target, this.previous));
    const prevMove = pmi >= 0 ? moves[pmi] : undefined;

    if (pmi >= 0) {
      moves.splice(pmi, 1);
    }

    const marks = this.marks[this.location.x][this.location.y];

    // * When entering a new junction, pick any new path
    // * When entering a previously explored junction via a new path turn around.
    // * When entering a previously explored junction via a previousy explored path, pick a new path with the fewest number of marks.
    // ** When able to pick between multiple paths, attempt to pick a path that shortens the distance between the current coordinates and the exit coordinates.

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
        throw new RobotError(`Robot ${this.name} cannot find a move`, this.color);
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
          !this.maze.isSame(move.target, prev) && this.marks[curr.x][curr.y][move.direction] === 1,
      );

      if (next) {
        prev = curr;
        curr = next.target;
        path.push(curr);
      } else {
        throw new Error('No solution found for tremaux');
      }
    }

    return path;
  }
}

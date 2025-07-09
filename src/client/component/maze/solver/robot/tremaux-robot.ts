import { create2DArray } from '@technobuddha/library';

import { type Cell, type Direction, type Move } from '../../geometry/index.ts';
import { darken } from '../../library/index.ts';

import { Robot, type RobotProperties } from './robot.ts';
import { RobotError } from './robot-error.ts';

export type TremauxRobotProperties = RobotProperties & {
  showMarks?: boolean;
  pathColor?: string;
  blockedColor?: string;
};

export class TremauxRobot extends Robot {
  public algorithm = 'trémaux';
  protected readonly showMarks: boolean = true;
  protected readonly markedColor: string;
  protected readonly blockedColor: string;
  protected readonly marks: Record<Direction, number>[][];

  public constructor({
    maze,
    program = 'random',
    showMarks = false,
    pathColor = maze.color.path,
    blockedColor = maze.color.blocked,
    ...props
  }: TremauxRobotProperties) {
    super({ maze, program, ...props });
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

    this.avatar = (cell, color) => this.maze.drawStar(cell, color);
  }

  private drawMark(cell: Cell, direction: Direction): void {
    if (this.showMarks) {
      const m = this.marks[cell.x][cell.y][direction];
      this.maze.drawWall({ ...cell, direction }, m === 1 ? this.markedColor : this.blockedColor);
    }
  }

  protected move(next: Move): void {
    this.marks[this.location.x][this.location.y][next.direction] = Math.min(
      this.marks[this.location.x][this.location.y][next.direction] + 1,
      2,
    );
    this.marks[next.target.x][next.target.y][this.maze.opposite(next.target.facing)] = Math.min(
      this.marks[next.target.x][next.target.y][this.maze.opposite(next.target.facing)] + 1,
      2,
    );

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

  public execute(): void {
    const moves = this.maze.moves(this.location, { wall: false });
    if (moves.length === 0) {
      throw new RobotError(`${this.name} cannot find a move`, this.color);
    }

    const pmi = moves.findIndex(({ target }) => this.maze.isSame(target, this.previous));
    const prevMove = pmi >= 0 ? moves[pmi] : undefined;

    if (pmi >= 0) {
      moves.splice(pmi, 1);
    }

    const marks = this.marks[this.location.x][this.location.y];

    if (moves.length > 0 && moves.every((m) => marks[m.direction] === 0)) {
      // * If only the entrance you just came from is marked, pick an arbitrary unmarked
      // * entrance, if any. This rule also applies if you're just starting in the middle
      // * of the maze and there are no marked entrances at all.
      const next = this.decide(moves);
      if (next) {
        this.move(next);
      } else {
        throw new RobotError(`${this.name} cannot decide`, this.color);
      }
    } else if (
      prevMove &&
      moves.every((m) => marks[m.direction] === 1) &&
      marks[prevMove.direction] < 2
    ) {
      // * If all entrances are marked, go back through the entrance you just came from,
      // * unless it is marked twice. This rule will apply whenever you reach a dead end.
      this.move(prevMove);
    } else if (moves.length === 0) {
      if (prevMove) {
        this.move(prevMove);
      } else {
        throw new RobotError(`${this.name} cannot find a move`, this.color);
      }
    } else {
      // * Pick any entrance with the fewest marks (zero if possible, else one).
      const ranked = this.randomShuffle(
        moves.map((move) => ({ ...move, marks: marks[move.direction] })),
      ).sort((a, b) => a.marks - b.marks);
      const best = ranked.filter((move) => move.marks === ranked[0].marks);

      const next = this.decide(best);
      if (next) {
        this.move(next);
      } else {
        throw new RobotError(`${this.name} cannot decide`, this.color);
      }
    }
  }

  // public override path(): CellFacing[] {
  //   let curr: CellFacing = this.start;
  //   let prev: CellFacing = this.start;

  //   const path: CellFacing[] = [curr];
  //   while (!this.maze.isSame(curr, this.location)) {
  //     const moves = this.maze.moves(curr, { wall: false }).filter(
  //       // eslint-disable-next-line @typescript-eslint/no-loop-func
  //       (move) =>
  //         !this.maze.isSame(move.target, prev) && this.marks[curr.x][curr.y][move.direction] === 1,
  //     );

  //     if (moves.length === 0 || moves.length > 1) {
  //       throw new RobotError(`${this.name} can not find a solution`, this.color);
  //     }

  //     const [next] = moves;
  //     prev = curr;
  //     curr = next.target;
  //     path.push(curr);
  //   }

  //   return path;
  // }
}

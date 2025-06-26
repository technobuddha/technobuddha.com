import { create2DArray } from '@technobuddha/library';

import { type Cell, type CellDirection, type Direction } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

export type TremauxProperties = MazeSolverProperties & {
  avatarColor?: string;
  pathColor?: string;
  blockedColor?: string;
};

export class Tremaux extends MazeSolver {
  public avatarColor: string;
  public pathColor: string;
  public blockedColor: string;
  private curr: CellDirection;
  private prev: Cell | undefined = undefined;

  private readonly marks: Record<Direction, number>[][];

  public constructor({
    maze,
    avatarColor = maze.avatarColor,
    pathColor = maze.pathColor,
    blockedColor = maze.blockedColor,
    ...props
  }: TremauxProperties) {
    super({ maze, ...props });
    this.avatarColor = avatarColor;
    this.pathColor = pathColor;
    this.blockedColor = blockedColor;

    this.marks = create2DArray(
      this.maze.width,
      this.maze.height,
      (x, y) =>
        Object.fromEntries(
          Object.entries(this.maze.nexus({ x: x, y: y }).walls).map(([k]) => [k as Direction, 0]),
        ) as Record<Direction, number>,
    );
    this.curr = this.maze.entrance;
  }

  private drawMark(cd: CellDirection, markedColor: string, blockedColor: string): void {
    const m = this.marks[cd.x][cd.y][cd.direction];
    if (m === 1) {
      this.maze.drawWall(cd, markedColor);
    } else if (m >= 2) {
      this.maze.drawWall(cd, blockedColor);
    }
  }

  private moveTo(
    next: CellDirection,
    avatarColor: string,
    markedColor: string,
    blockedColor: string,
  ): void {
    this.marks[this.curr.x][this.curr.y][next.direction]++;
    this.marks[next.x][next.y][this.maze.opposite(next.direction)]++;

    this.maze.drawCell(this.curr);
    for (const direction of Object.keys(this.marks[this.curr.x][this.curr.y]) as Direction[]) {
      this.drawMark({ ...this.curr, direction }, markedColor, blockedColor);
    }

    this.maze.drawAvatar(this.maze.drawCell(next), avatarColor);

    for (const direction of Object.keys(this.marks[next.x][next.y]) as Direction[]) {
      this.drawMark({ ...next, direction }, markedColor, blockedColor);
    }

    this.prev = this.curr;
    this.curr = next;
  }

  public async *solve({
    markedColor = this.pathColor,
    blockedColor = this.blockedColor,
    avatarColor = this.avatarColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    this.curr = entrance;
    this.prev = undefined;

    while (!this.maze.isSame(this.curr, exit)) {
      // if (Object.values(this.maze.nexus({x: this.curr.x, y: this.curr.y}).walls).every((w) => !w)) {
      //   const next = this.maze.move(this.curr, this.curr.direction);
      //   if (!next) {
      //     throw new Error('can not get out of passage');
      //   }
      //   this.moveTo(next, avatarColor, markedColor, blockedColor);
      //   yield;
      //   continue;
      // }

      const moves = this.maze.moves(this.curr, { wall: false }).map(({ move }) => move);

      const pmi = moves.findIndex((c) => c.x === this.prev?.x && c.y === this.prev?.y);
      const prevMove = pmi >= 0 ? moves[pmi] : undefined;

      if (pmi >= 0) {
        moves.splice(pmi, 1);
      }

      const marks = this.marks[this.curr.x][this.curr.y];

      if (moves.length > 0 && moves.every((m) => marks[m.direction] === 0)) {
        // 1. If only the entrance you just came from is marked, pick an arbitrary unmarked
        //    entrance, if any. This rule also applies if you're just starting in the middle
        //    of the maze and there are no marked entrances at all.
        const next = this.randomPick(moves)!;
        //           //this.marks[next.x][next.y]++;
        this.moveTo(next, avatarColor, markedColor, blockedColor);
        yield;
      } else if (
        prevMove &&
        moves.every((m) => marks[m.direction] === 1) &&
        marks[prevMove.direction] < 2
      ) {
        // 2. If all entrances are marked, go back through the entrance you just came from,
        //    unless it is marked twice. This rule will apply whenever you reach a dead end.
        this.moveTo(prevMove, avatarColor, markedColor, blockedColor);
        yield;
        // 3. Pick any entrance with the fewest marks (zero if possible, else one).
      } else if (moves.length === 0) {
        if (prevMove) {
          this.moveTo(prevMove, avatarColor, markedColor, blockedColor);
          yield;
        } else {
          // eslint-disable-next-line no-debugger
          debugger;
          throw new Error('No moves found for tremaux');
        }
      } else {
        const [next] = this.randomShuffle(moves).sort(
          (a, b) => marks[a.direction] - marks[b.direction],
        );

        this.moveTo(next, avatarColor, markedColor, blockedColor);
        yield;
      }
    }

    this.curr = entrance;

    while (!this.maze.isSame(this.curr, exit)) {
      const [next] = this.maze
        .moves(this.curr, { wall: false })
        .filter(
          ({ move }) =>
            !(move.x === this.prev?.x && move.y === this.prev?.y) &&
            this.marks[this.curr.x][this.curr.y][move.direction] === 1,
        );

      if (next) {
        this.maze.solution.push({ ...this.curr, direction: next.direction });
        this.prev = this.curr;
        this.curr = next.move;
      } else {
        throw new Error('No solution found for tremaux');
      }
    }
  }
}

import { create2DArray } from '@technobuddha/library';

import { animate } from '../drawing/animate.ts';
import { type Cell, type CellDirection, type Direction } from '../maze/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type TremauxProperties = MazeSolverProperties;

export class Tremaux extends MazeSolver {
  private curr: Cell;
  private prev: Cell | undefined = undefined;
  private readonly marks: Record<Direction, number>[][];

  public constructor(props: TremauxProperties) {
    super(props);
    this.marks = create2DArray(this.maze.width, this.maze.height, (x, y) =>
      Object.fromEntries(Object.entries(this.maze.walls[x][y]).map(([k]) => [k, 0])),
    );
    this.curr = this.maze.entrance;
  }

  private drawMark(cd: CellDirection): void {
    const m = this.marks[cd.x][cd.y][cd.direction];
    if (m === 1) {
      this.maze.drawWall(cd, 'lime'); //' #87CEFA');
    } else if (m >= 2) {
      this.maze.drawWall(cd, '#FF0000');
    }
  }

  private async moveTo(next: CellDirection): Promise<void> {
    return animate(() => {
      this.marks[this.curr.x][this.curr.y][next.direction]++;
      this.marks[next.x][next.y][this.maze.opposite(next.direction)]++;

      this.maze.drawCell(this.curr);
      for (const direction of Object.keys(this.marks[this.curr.x][this.curr.y])) {
        this.drawMark({ ...this.curr, direction });
      }

      this.maze.drawCell(next, ' #6495ED');
      for (const direction of Object.keys(this.marks[next.x][next.y])) {
        this.drawMark({ ...next, direction });
      }

      this.prev = this.curr;
      this.curr = next;
    });
  }

  public async solve({
    // color =' #6495ED',
    // solutionColor = '#00FF00',
    entrance = this.maze.entrance,
    // exit = this.maze.exit,
  } = {}): Promise<void> {
    this.curr = entrance;
    this.prev = undefined;

    while (this.curr.x !== this.maze.exit.x || this.curr.y !== this.maze.exit.y) {
      const moves = this.maze.validMoves(this.curr);
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
        await this.moveTo(next);
      } else if (
        prevMove &&
        moves.every((m) => marks[m.direction] === 1) &&
        marks[prevMove.direction] < 2
      ) {
        // 2. If all entrances are marked, go back through the entrance you just came from,
        //    unless it is marked twice. This rule will apply whenever you reach a dead end.
        await this.moveTo(prevMove);
      } else {
        // 3. Pick any entrance with the fewest marks (zero if possible, else one).
        const [next] = this.randomShuffle(moves.filter((m) => marks[m.direction] < 2)).sort(
          (a, b) => marks[a.direction] - marks[b.direction],
        );

        await this.moveTo(next);
      }
    }

    this.maze.clear();
    this.maze.drawDistances();
    this.curr = this.maze.entrance;

    while (this.curr.x !== this.maze.exit.x || this.curr.y !== this.maze.exit.y) {
      const [move] = this.maze
        .validMoves(this.curr)
        .filter(
          (m) =>
            !(m.x === this.prev?.x && m.y === this.prev?.y) &&
            this.marks[this.curr.x][this.curr.y][m.direction] === 1,
        );

      if (move) {
        this.maze.drawPath({ ...this.curr, direction: move.direction });
        this.prev = this.curr;
        this.curr = move;
      } else {
        debugger;
      }
    }
  }
}

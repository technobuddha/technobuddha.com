/* eslint-disable unicorn/no-empty-file */
// import { create2DArray } from '@technobuddha/library';

// import { type Cell } from '../../maze/maze.js';

// import { MazeSolver, type MazeSolverProperties } from '../maze-solver.js';

// export class Trémaux extends MazeSolver {
//   private in: 'passage' | 'junction' = 'passage';
//   private curr: Cell;
//   private prev: Cell | undefined = undefined;
//   private readonly marks: number[][];

//   public constructor(props: MazeSolverProperties) {
//     super(props);
//     this.marks = create2DArray(this.maze.width, this.maze.height, 0);
//     this.curr = this.maze.entrance;
//   }

//   private isPassage(cell: Cell): boolean {
//     if (cell.x === this.maze.entrance.x && cell.y === this.maze.entrance.y) {
//       return true;
//     }

//     return this.maze.validMoves(cell).length === 2;
//   }

//   private drawMark(cell: Cell): void {
//     const m = this.marks[cell.x][cell.y];
//     if (m === 1) {
//       this.maze.drawCircle(cell, ' #87CEFA');
//     } else if (m >= 2) {
//       this.maze.drawX(cell);
//     }
//   }

//   private moveTo(next: Cell): void {
//     // const enteringPassage = this.maze.validMoves(next).length === 2;
//     // const leavingPassage =
//     //   this.maze.validMoves(this.curr).length +
//     //     (this.curr.x === this.maze.entrance.x && this.curr.y === this.maze.entrance.y ? 1 : 0) ===
//     //   2;

//     // if (leavingPassage && !enteringPassage) {
//     //   this.marks[this.curr.x][this.curr.y]++;
//     // } else if (enteringPassage && !leavingPassage) {
//     //   this.marks[next.x][next.y]++;
//     // }

//     this.maze.drawCell(this.curr);
//     this.drawMark(this.curr);

//     this.maze.drawCell(next, ' #6495ED');
//     this.drawMark(next);
//   }

//   // eslint-disable-next-line @typescript-eslint/require-await
//   public async solve({
//     // color =' #6495ED',
//     // solutionColor = '#00FF00',
//     entrance = this.maze.entrance,
//     // exit = this.maze.exit,
//   } = {}): Promise<void> {
//     this.curr = entrance;
//     this.prev = undefined;

//     while (true) {
//       for (let i = 0; i < 1; i++) {
//         const moves = this.maze
//           .validMoves(this.curr)
//           .filter((c) => c.x !== this.prev?.x || c.y !== this.prev?.y);

//         if (this.prev && this.isPassage(this.prev) && !this.isPassage(this.curr)) {
//           this.marks[this.prev.x][this.prev.x]++;
//           this.drawMark(this.prev);
//         }

//         if (moves.length > 0 && moves.every((c) => this.marks[c.x][c.y] === 0)) {
//           // 1. If only the entrance you just came from is marked, pick an arbitrary unmarked
//           //    entrance, if any. This rule also applies if you're just starting in the middle
//           //    of the maze and there are no marked entrances at all.
//           const next = this.randomPick(moves)!;
//           if (this.isPassage(next) && !this.isPassage(this.curr)) {
//             this.marks[next.x][next.y]++;
//           }
//           //this.marks[next.x][next.y]++;
//           //this.drawMark(next);
//           this.moveTo(next);
//           this.prev = this.curr;
//           this.curr = next;
//         } else if (
//           this.prev &&
//           this.marks[this.curr.x][this.curr.y] < 2 &&
//           moves.every((c) => this.marks[c.x][c.y] !== 0)
//         ) {
//           // 2. If all entrances are marked, go back through the entrance you just came from,
//           //    unless it is marked twice. This rule will apply whenever you reach a dead end.

//           // this.marks[this.prev.x][this.prev.y]++;
//           const next = this.prev;
//           console.log(2, this.in, this.curr, next);
//           this.moveTo(next);
//           this.prev = this.curr;
//           this.curr = next;
//         } else {
//           // 3. Pick any entrance with the fewest marks (zero if possible, else one).

//           const [next] = this.randomShuffle(moves.filter((m) => this.marks[m.x][m.y] < 2)).sort(
//             (a, b) => this.marks[a.x][a.y] - this.marks[b.x][b.y],
//           );

//           console.log(3, this.in, this.curr, next);

//           this.moveTo(next);
//           this.prev = this.curr;
//           this.curr = next;
//         }
//       }
//     }
//   }
// }

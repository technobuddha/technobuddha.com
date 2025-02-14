// /*
//  * decaffeinate suggestions:
//  * DS101: Remove unnecessary use of Array.from
//  * DS102: Remove unnecessary code created because of implicit returns
//  * DS202: Simplify dynamic range loops
//  * DS205: Consider reworking code to avoid use of IIFEs
//  * DS206: Consider reworking classes to avoid initClass
//  * DS207: Consider shorter variations of null checks
//  * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
//  */
// /*
// Author: Jamis Buck <jamis@jamisbuck.org>
// License: Public domain, baby. Knock yourself out.
// The original CoffeeScript sources are always available on GitHub:
// http://github.com/jamis/csmazes
// */

// const Cls = (Maze.Algorithms.Kruskal = class Kruskal extends Maze.Algorithm {
//   static initClass() {
//     this.prototype.WEAVE = 1;
//     this.prototype.JOIN =  2;
//   }

//   constructor(maze, options) {
//     super(...arguments);

//     this.sets = [];
//     this.edges = [];

//     for (let y = 0, end = this.maze.height, asc = 0 <= end; asc ? y < end : y > end; asc ? y++ : y--) {
//       this.sets.push([]);
//       for (let x = 0, end1 = this.maze.width, asc1 = 0 <= end1; asc1 ? x < end1 : x > end1; asc1 ? x++ : x--) {
//         this.sets[y].push(new Maze.Algorithms.Kruskal.Tree());
//         if (y > 0) { this.edges.push({x, y, direction: Maze.Direction.N}); }
//         if (x > 0) { this.edges.push({x, y, direction: Maze.Direction.W}); }
//       }
//     }

//     this.rand.randomizeList(this.edges);

//     this.weaveMode = options.weaveMode != null ? options.weaveMode : "onePhase";
//     if (typeof this.weaveMode === "function") { this.weaveMode = this.weaveMode(); }

//     this.weaveDensity = options.weaveDensity != null ? options.weaveDensity : 80;
//     if (typeof this.weaveDensity === "function") { this.weaveDensity = this.weaveDensity(); }

//     this.state = (this.maze.isWeave != null) && (this.weaveMode === "twoPhase") ? this.WEAVE : this.JOIN;
//   }

//   connect(x1, y1, x2, y2, direction) {
//     this.sets[y1][x1].connect(this.sets[y2][x2]);

//     this.maze.carve(x1, y1, direction);
//     this.updateAt(x1, y1);

//     this.maze.carve(x2, y2, Maze.Direction.opposite[direction]);
//     return this.updateAt(x2, y2);
//   }

//   weaveStep() {
//     if ((this.x == null)) {
//       this.y = 1;
//       this.x = 1;
//     }

//     return (() => {
//       const result = [];
//       while (this.state === this.WEAVE) {
//         if (this.maze.isBlank(this.x, this.y) && (this.rand.nextInteger(100) < this.weaveDensity)) {
//           const [nx, ny] = Array.from([this.x, this.y-1]);
//           const [wx, wy] = Array.from([this.x-1, this.y]);
//           const [ex, ey] = Array.from([this.x+1, this.y]);
//           const [sx, sy] = Array.from([this.x, this.y+1]);

//           const safe = !this.sets[ny][nx].isConnectedTo(this.sets[sy][sx]) &&
//             !this.sets[wy][wx].isConnectedTo(this.sets[ey][ex]);

//           if (safe) {
//             this.sets[ny][nx].connect(this.sets[sy][sx]);
//             this.sets[wy][wx].connect(this.sets[ey][ex]);

//             if (this.rand.nextBoolean()) {
//               this.maze.carve(this.x, this.y, Maze.Direction.E|Maze.Direction.W|Maze.Direction.U);
//             } else {
//               this.maze.carve(this.x, this.y, Maze.Direction.N|Maze.Direction.S|Maze.Direction.U);
//             }

//             this.maze.carve(nx, ny, Maze.Direction.S);
//             this.maze.carve(wx, wy, Maze.Direction.E);
//             this.maze.carve(ex, ey, Maze.Direction.W);
//             this.maze.carve(sx, sy, Maze.Direction.N);

//             this.updateAt(this.x, this.y);
//             this.updateAt(nx, ny);
//             this.updateAt(wx, wy);
//             this.updateAt(ex, ey);
//             this.updateAt(sx, sy);

//             const newEdges = [];
//             for (let edge of Array.from(this.edges)) {
//               if (((edge.x === this.x) && (edge.y === this.y)) ||
//                 ((edge.x === ex) && (edge.y === ey) && (edge.direction === Maze.Direction.W)) ||
//                 ((edge.x === sx) && (edge.y === sy) && (edge.direction === Maze.Direction.N))) { continue; }
//               newEdges.push(edge);
//             }
//             this.edges = newEdges;

//             break;
//           }
//         }

//         this.x++;
//         if (this.x >= (this.maze.width-1)) {
//           this.x = 1;
//           this.y++;

//           if (this.y >= (this.maze.height-1)) {
//             this.state = this.JOIN;
//             result.push(this.eventAt(this.x, this.y));
//           } else {
//             result.push(undefined);
//           }
//         } else {
//           result.push(undefined);
//         }
//       }
//       return result;
//     })();
//   }

//   joinStep() {
//     return (() => {
//       const result = [];
//       while (this.edges.length > 0) {
//         const edge = this.edges.pop();

//         const nx = edge.x + Maze.Direction.dx[edge.direction];
//         const ny = edge.y + Maze.Direction.dy[edge.direction];

//         const set1 = this.sets[edge.y][edge.x];
//         const set2 = this.sets[ny][nx];

//         if ((this.maze.isWeave != null) && (this.weaveMode === "onePhase") && this.maze.isPerpendicular(nx, ny, edge.direction)) {
//           const nx2 = nx + Maze.Direction.dx[edge.direction];
//           const ny2 = ny + Maze.Direction.dy[edge.direction];
//           let set3 = null;

//           for (let index = 0, end = this.edges.length, asc = 0 <= end; asc ? index < end : index > end; asc ? index++ : index--) {
//             const edge2 = this.edges[index];
//             if ((edge2.x === nx) && (edge2.y === ny) && (edge2.direction === edge.direction)) {
//               this.edges.splice(index, 1);
//               set3 = this.sets[ny2][nx2];
//               break;
//             }
//           }

//           if (set3 && !set1.isConnectedTo(set3)) {
//             this.connect(edge.x, edge.y, nx2, ny2, edge.direction);
//             this.performThruWeave(nx, ny);
//             this.updateAt(nx, ny);
//             break;
//           } else if (!set1.isConnectedTo(set2)) {
//             this.connect(edge.x, edge.y, nx, ny, edge.direction);
//             break;
//           } else {
//             result.push(undefined);
//           }

//         } else if (!set1.isConnectedTo(set2)) {
//           this.connect(edge.x, edge.y, nx, ny, edge.direction);
//           break;
//         } else {
//           result.push(undefined);
//         }
//       }
//       return result;
//     })();
//   }

//   step() {
//     switch (this.state) {
//       case this.WEAVE: this.weaveStep(); break;
//       case this.JOIN:  this.joinStep(); break;
//     }

//     return this.edges.length > 0;
//   }
// });
// Cls.initClass();

// Maze.Algorithms.Kruskal.Tree = class Tree {
//   constructor() { this.up = null; }
//   root() { if (this.up) { return this.up.root(); } else { return this; } }
//   isConnectedTo(tree) { return this.root() === tree.root(); }
//   connect(tree) { return tree.root().up = this; }
// };

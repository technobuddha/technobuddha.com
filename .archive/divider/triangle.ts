/* eslint-disable unicorn/no-empty-file */
//  public divider(cell1: Cell, cell2: Cell): CellDirection[] {
//     if (cell1.x === cell2.x) {
//       const dividers = range(cell1.y, cell2.y).map((y) =>
//         cell1.x % 2 === 0 ?
//           y % 2 === 0 ?
//             { x: cell1.x, y, direction: 'f' }
//           : { x: cell1.x, y, direction: 'e' }
//         : y % 2 === 1 ? { x: cell1.x, y, direction: 'b' }
//         : { x: cell1.x, y, direction: 'c' },
//       );

//       // if (cell1.y === 0) {
//       //   dividers.unshift();
//       // }
//       // if (cell2.y === this.height) {
//       //   dividers.pop();
//       // }

//       return dividers;
//     } else if (cell1.y === cell2.y) {
//       const dividers = range(cell1.x, cell2.x).flatMap(
//         (x) => ((x + cell1.y) % 2 === 1 ? { x, y: cell1.y, direction: 'a' } : []), //{ x, y: cell1.y, direction: 'a' },
//       );

//       if ((cell1.x + cell1.y) % 2 === 0) {
//         // dividers.pop();
//       } else {
//         // dividers.shift();
//       }

//       return dividers;
//     }

//     throw new Error('Cells must be aligned vertically or horizontally');
//   }

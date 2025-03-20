/* eslint-disable unicorn/no-empty-file */
// public divider(cell1: Cell, cell2: Cell): CellDirection[] {
//     if (cell1.x === cell2.x) {
//       const dividers = range(cell1.y, cell2.y).flatMap((y) =>
//         this.cellKind({ x: cell1.x, y }) === 0 ?
//           [{ x: cell1.x, y, direction: 'c' }]
//         : [
//             { x: cell1.x, y, direction: 'b' },
//             { x: cell1.x, y, direction: 'c' },
//             { x: cell1.x, y, direction: 'd' },
//           ],
//       );

//       if (cell2.y >= this.height - 1 && this.cellKind(cell2) === 0) {
//         dividers.pop();
//       }

//       return dividers;
//     } else if (cell1.y === cell2.y) {
//       const dividers = range(cell1.x, cell2.x).flatMap((x) => [
//         { x, y: cell1.y, direction: 'e' },
//         { x, y: cell1.y, direction: 'd' },
//       ]);

//       if (this.cellKind(cell1) === 0) {
//         dividers.shift();
//       } else {
//         dividers.pop();
//       }

//       return dividers;
//     }

//     throw new Error('Cells must be aligned vertically or horizontally');
//   }

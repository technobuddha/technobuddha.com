/* eslint-disable unicorn/no-empty-file */
//  public divider(cell1: Cell, cell2: Cell): CellDirection[] {
//     if (cell1.x === cell2.x) {
//       const walls: CellDirection[] = range(cell1.y, cell2.y).flatMap((y) => [
//         { x: cell1.x, y, direction: 'b' },
//         { x: cell1.x, y, direction: 'c' },
//       ]);

//       if (cell1.x % 2 === 0) {
//         walls.shift();
//       } else {
//         walls.pop();
//       }

//       return walls;
//     } else if (cell1.y === cell2.y) {
//       const walls: CellDirection[] = range(cell1.x, cell2.x).flatMap((x) =>
//         x % 2 === 0 ?
//           { x, y: cell1.y, direction: 'd' }
//         : [
//             { x, y: cell1.y, direction: 'e' },
//             { x, y: cell1.y, direction: 'd' },
//             { x, y: cell1.y, direction: 'c' },
//           ],
//       );

//       if (cell1.x % 2 === 1) {
//         walls.shift();
//       } else {
//         walls.pop();
//       }

//       return walls;
//     }

//     throw new Error('Cells must be aligned vertically or horizontally');
//   }

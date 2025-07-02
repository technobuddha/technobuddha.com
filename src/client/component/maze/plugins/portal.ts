import { type Maze } from '../geometry/index.ts';

export function portalPlugin(maze: Maze): void {
  maze.hookPreGeneration = () => {
    for (let i = 0; i < 1; ++i) {
      const cell1 = maze.randomCell();
      const kind = maze.cellKind(cell1);

      let cell2 = maze.randomCell();
      while (maze.cellKind(cell2) !== kind || maze.isSame(cell1, cell2)) {
        cell2 = maze.randomCell();
      }

      for (const move of maze.moves(cell1, { wall: 'all' })) {
        maze.nexus(cell2).tunnels[move.direction] = move.target;
      }
      for (const move of maze.moves(cell2, { wall: 'all' })) {
        maze.nexus(cell1).tunnels[move.direction] = move.target;
      }

      maze.nexus(cell1).bridge = true;
      maze.nexus(cell2).bridge = true;
    }
  };
}

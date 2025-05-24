import { type Maze } from '../geometry/maze.ts';

export function portalPlugin(maze: Maze): void {
  maze.hookPreGeneration = () => {
    for (let i = 0; i < 1; ++i) {
      const cell1 = maze.randomCell();
      const kind = maze.cellKind(cell1);

      let cell2 = maze.randomCell();
      while (maze.cellKind(cell2) !== kind || maze.isSame(cell1, cell2)) {
        cell2 = maze.randomCell();
      }

      for (const move of maze.neighbors(cell1)) {
        maze.nexus(cell2).portals[move.direction] = move;
      }
      for (const move of maze.neighbors(cell2)) {
        maze.nexus(cell1).portals[move.direction] = move;
      }

      maze.nexus(cell1).bridge = true;
      maze.nexus(cell2).bridge = true;
    }
  };
}

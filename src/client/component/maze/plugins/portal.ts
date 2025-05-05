import { type Maze } from '../geometry/maze.ts';

export function portalPlugin(maze: Maze): void {
  maze.hookPreGeneration = () => {
    for (let i = 0; i < 10; ++i) {
      const cell1 = maze.randomCell();
      const kind = maze.cellKind(cell1);

      let cell2 = maze.randomCell();
      while (maze.cellKind(cell2) !== kind || maze.isSame(cell1, cell2)) {
        cell2 = maze.randomCell();
      }

      for (const w of Object.keys(maze.nexus(cell1).walls)) {
        // const move1 = maze.move(cell2, w)!;
        maze.nexus(cell1).portals[w] = { ...cell2, direction: w }; //move1; //{ ...move1, direction: maze.opposite(move1) };
        maze.nexus(cell1).destination = true;
        // const move2 = maze.move(cell1, w)!;?
        maze.nexus(cell2).portals[w] = { ...cell1, direction: w }; //move2; //{ ...move2, direction: maze.opposite(move2) };
        maze.nexus(cell2).destination = true;

        // maze.nexus(cell1).walls[w] = false;
        // maze.nexus(cell2).walls[w] = false;
      }

      maze.nexus(cell1).bridge = true;
      maze.nexus(cell2).bridge = true;
    }
  };
}

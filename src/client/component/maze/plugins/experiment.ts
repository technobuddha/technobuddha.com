import { create2DArray } from '@technobuddha/library';

import { type CellDirection, type Maze } from '../geometry/index.ts';

const NUMBER_OF_BRIDGES = 150;
const BRIDGE_LENGTH = 5;

function findBridgeEntrance(maze: Maze, forbiddenZone: boolean[][]): CellDirection {
  let cell: CellDirection | undefined = undefined;
  do {
    cell = maze.randomPick(maze.moves(maze.randomCell()).filter((c) => !forbiddenZone[c.x][c.y]));
  } while (cell === undefined);
  return cell;
}

export function experimentalPlugin(maze: Maze): void {
  const bridges: CellDirection[][] = [];

  maze.hookPreGeneration = (generator) => {
    let cell: CellDirection | undefined = undefined;
    const forbiddenZone = create2DArray(maze.width, maze.height, false);
    for (const edge of maze.cellsOnEdge()) {
      forbiddenZone[edge.x][edge.y] = true;
    }

    for (let j = 0; j < NUMBER_OF_BRIDGES; ++j) {
      const len = BRIDGE_LENGTH;
      const bridge: CellDirection[] = [];

      const { x, y, direction } = findBridgeEntrance(maze, forbiddenZone);
      cell = { x, y, direction };
      const opposite = maze.opposite(cell);

      for (let i = 0; i < len; i++) {
        if (cell) {
          bridge.push(cell);
          forbiddenZone[cell.x][cell.y] = true;

          const [dir] = maze.straight(cell);
          const next = maze.move(cell, dir);

          if (next) {
            if (maze.inMaze(next)) {
              if (forbiddenZone[next.x][next.y]) {
                // bridge enters the forbidden zone (near another bridge)
                break;
              } else {
                cell = next;
              }
            } else {
              // bridge bumps into the edge of the maze
              break;
            }
          }
        }
      }

      const enter = bridge.at(0);
      const exit = bridge.at(-1);

      if (enter && exit) {
        const exitCell = maze.move(exit, exit.direction)!;
        maze.nexus(enter).tunnels[enter.direction] = { ...exitCell };

        const enterCell = maze.move(enter, maze.opposite(enter))!;
        maze.nexus(exit).tunnels[maze.opposite(exit)] = { ...enterCell };
      }

      for (cell of bridge) {
        for (const tunnelEntrance of maze
          .moves(cell)
          .filter((c) => c.direction !== direction && c.direction !== opposite)) {
          const moveDirection = maze
            .straight({ ...cell, direction: maze.opposite(tunnelEntrance) })
            .at(0)!;
          const tunnelExit = maze.move(cell, moveDirection)!;

          maze.nexus(cell).tunnels[maze.opposite(tunnelEntrance)] = tunnelExit;
        }

        for (const neighbor of maze.moves(cell)) {
          if (maze.inMaze(neighbor)) {
            forbiddenZone[neighbor.x][neighbor.y] = true;
          }
        }

        maze.nexus(cell).bridge = true;

        const wall = maze.nexus(cell).walls;
        for (const d of Object.keys(wall)) {
          delete wall[d];
        }
      }

      bridges.push(bridge);
    }

    for (const bridge of bridges) {
      for (const span of bridge) {
        maze.nexus(span).mask = true;
      }
      // generator.addBridge(bridge);
    }
  };
  maze.hookPostGeneration = () => {
    for (const bridge of bridges) {
      for (const span of bridge) {
        maze.nexus(span).mask = false;
      }
    }

    for (const bridge of bridges) {
      const enter = bridge.at(0)!;
      const exit = bridge.at(-1)!;
      maze.nexus(enter).tunnels[enter.direction] = false;
      maze.nexus(exit).tunnels[maze.opposite(exit)] = false;
      for (const span of bridge) {
        for (const w of Object.keys(maze.initialWalls(span))) {
          maze.nexus(span).walls[w] = w !== span.direction && w !== maze.opposite(span);
        }
      }
    }
  };
}

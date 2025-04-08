import { create2DArray } from '@technobuddha/library';

import { type CellDirection } from '../maze/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

type Strategy = 'random' | 'right-turn' | 'left-turn';

export type RecursiveBacktrackerProperties = MazeGeneratorProperties & {
  parallel?: number;
  strategy?: Strategy[];
};

export class RecursiveBacktracker extends MazeGenerator {
  private readonly parallel: number;
  private readonly current: (CellDirection | undefined)[];
  private readonly visited: (false | number)[][];
  public readonly stack: CellDirection[][];
  public readonly strategy: Strategy[];
  public player: number;

  public constructor({ parallel, strategy, ...props }: RecursiveBacktrackerProperties) {
    super(props);

    this.parallel = parallel ?? strategy?.length ?? 1;

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.current = [];
    this.strategy = [];

    const all = this.maze.all();
    for (let i = 0; i < this.parallel; ++i) {
      const index = Math.floor(this.random() * all.length);
      const randomCell = all[index];

      this.current.push({
        ...randomCell,
        direction: this.maze.opposite(
          this.randomPick(Object.keys(this.maze.walls[randomCell.x][randomCell.y]))!,
        ),
      });

      this.strategy.push(strategy?.shift() ?? 'random');
      this.visited[randomCell.x][randomCell.y] = i;

      all.splice(index, 1);
    }

    this.stack = this.current.map((c) => [c!]);

    this.player = 0;
  }

  public override step(): boolean {
    while (true) {
      // If all players are at the end of their stack, we need to join the segments
      if (this.current.every((c) => c === undefined)) {
        const borderCell = this.randomPick(
          this.maze
            .all()
            .filter((c) => this.visited[c.x][c.y] === 0)
            .flatMap((c) => this.maze.neighbors(c).filter((n) => this.visited[n.x][n.y] !== 0)),
        );

        if (borderCell) {
          this.maze.removeWall(borderCell, this.maze.opposite(borderCell.direction));

          const zone = this.visited[borderCell.x][borderCell.y];
          if (zone === false) {
            this.visited[borderCell.x][borderCell.y] = 0;
          } else {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < this.visited.length; ++i) {
              for (let j = 0; j < this.visited[i].length; ++j) {
                if (this.visited[i][j] === zone) {
                  this.visited[i][j] = 0;
                }
              }
            }
          }

          return true;
        }

        return false;
      }

      // Find the next player
      while (this.current[this.player] === undefined) {
        this.player = (this.player + 1) % this.parallel;
      }

      const currentCell = this.current[this.player]!;

      let newCell: CellDirection | null | undefined;
      switch (this.strategy[this.player]) {
        case 'right-turn': {
          newCell = this.maze
            .rightTurn(this.current[this.player]!.direction)
            .map((d) => this.maze.move(this.current[this.player]!, d))
            .find((c) => c && this.maze.inMaze(c) && this.visited[c.x][c.y] === false);
          break;
        }

        case 'left-turn': {
          newCell = this.maze
            .leftTurn(this.current[this.player]!.direction)
            .map((d) => this.maze.move(this.current[this.player]!, d))
            .find((c) => c && this.maze.inMaze(c) && this.visited[c.x][c.y] === false);
          break;
        }
        case 'random':
        default: {
          newCell = this.randomPick(
            this.maze.neighbors(currentCell).filter((c) => this.visited[c.x][c.y] === false),
          );
          break;
        }
      }

      if (newCell) {
        this.maze.drawCell(currentCell);
        this.maze.removeWall(currentCell, newCell.direction);

        this.stack[this.player].push(currentCell);
        this.current[this.player] = newCell;
        this.visited[newCell.x][newCell.y] = this.player;

        this.player = (this.player + 1) % this.parallel;
        return true;
      }

      this.current[this.player] = this.stack[this.player].pop();
    }
  }
}

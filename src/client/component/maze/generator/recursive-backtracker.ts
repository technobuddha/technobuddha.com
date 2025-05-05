import { create2DArray } from '@technobuddha/library';

import { type CellDirection } from '../geometry/maze.ts';

import { MazeGenerator, type MazeGeneratorProperties } from './maze-generator.ts';

type State = {
  current: CellDirection | undefined;
  strategy: Strategy;
  stack: CellDirection[];
  bias: boolean;
  bridge: {
    random: number;
  };
};

type Strategy = 'random' | 'right-turn' | 'left-turn' | 'straight' | 'bridge-builder';

export type RecursiveBacktrackerProperties = MazeGeneratorProperties & {
  parallel?: number;
  strategy?: Strategy[];
};

export class RecursiveBacktracker extends MazeGenerator {
  private readonly parallel: number;
  private readonly visited: (false | number)[][];
  public player: number;
  public state: State[];

  public constructor({ parallel, strategy, ...props }: RecursiveBacktrackerProperties) {
    super(props);

    this.parallel = parallel ?? strategy?.length ?? 1;

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.state = [];

    const all = this.maze.cellsInMaze();
    for (let i = 0; i < this.parallel; ++i) {
      const index = Math.floor(this.random() * all.length);
      const randomCell = all[index];

      const current: CellDirection = {
        ...randomCell,
        direction: this.maze.opposite({
          ...randomCell,
          direction: this.randomPick(Object.keys(this.maze.nexus(randomCell).walls))!,
        }),
      };

      this.state.push({
        current,
        strategy: strategy?.[i] ?? 'random',
        stack: [current],
        bias: true,
        bridge: {
          random: 1,
        },
      });

      this.visited[current.x][current.y] = i;

      all.splice(index, 1);
    }

    this.player = 0;
  }

  public step(state: State): {
    current: CellDirection;
    next: CellDirection | undefined;
  } {
    let current = state.current!;
    let next: CellDirection | undefined;
    switch (this.state[this.player].strategy) {
      case 'right-turn': {
        next = this.maze
          .rightTurn(current)
          .map((d) => this.maze.move(current, d))
          .filter((c) => c != null)
          .find((c) => this.maze.inMaze(c) && this.visited[c.x][c.y] === false);
        break;
      }

      case 'left-turn': {
        next = this.maze
          .leftTurn(current)
          .map((d) => this.maze.move(current, d))
          .filter((c) => c != null)
          .find((c) => this.maze.inMaze(c) && this.visited[c.x][c.y] === false);
        break;
      }

      case 'straight': {
        next = this.maze
          .straight(current, state.bias)
          .map((d) => this.maze.move(current, d))
          .filter((c) => c != null)
          .find((c) => this.maze.inMaze(c) && this.visited[c.x][c.y] === false);

        state.bias = !state.bias;
        break;
      }

      case 'bridge-builder': {
        if (state.bridge.random <= 0) {
          let probe = current;
          const bridge: CellDirection[] = [];

          while (true) {
            const [dir] = this.maze.straight(probe, state.bias);
            state.bias = !state.bias;

            const cell = this.maze.move(probe, dir);
            if (cell && this.maze.inMaze(cell) && this.visited[cell.x][cell.y] === false) {
              bridge.push(cell);
              probe = cell;
            } else {
              break;
            }
          }

          if (bridge.length > 2) {
            if (bridge.length > 2) {
              bridge.length = 2;
            }
            next = bridge.pop()!;
            for (const span of bridge) {
              this.maze.nexus(span).bridge = true;
              this.maze.removeWall(current, span.direction);
              // yield;
              this.visited[span.x][span.y] = this.player;

              for (const tunnelEntrance of this.maze
                .neighbors(span)
                .filter(
                  (c) => c.direction !== span.direction && c.direction !== this.maze.opposite(span),
                )) {
                const moveDirection = this.maze
                  .straight({ ...span, direction: this.maze.opposite(tunnelEntrance) })
                  .at(0)!;
                const tunnelExit = this.maze.move(span, moveDirection)!;

                this.maze.nexus(span).portals[this.maze.opposite(tunnelEntrance)] = tunnelExit;
              }

              current = span;
            }

            state.bridge.random = 1;
            break;
          }
        }

        state.bridge.random -= 1;
        next = this.randomPick(
          this.maze.neighbors(current).filter((c) => this.visited[c.x][c.y] === false),
        );

        break;
      }

      case 'random':
      default: {
        next = this.randomPick(
          this.maze.neighbors(current).filter((c) => this.visited[c.x][c.y] === false),
        );
        break;
      }
    }

    return { current, next };
  }

  public *generate(): Generator<void> {
    while (true) {
      // If all players are at the end of their stack, we need to join the segments
      if (this.state.every((s) => s.current === undefined)) {
        const borderCell = this.randomPick(
          this.maze
            .cellsInMaze()
            .filter((c) => this.visited[c.x][c.y] === 0)
            .flatMap((c) => this.maze.neighbors(c).filter((n) => this.visited[n.x][n.y] !== 0)),
        );

        if (borderCell) {
          this.maze.removeWall(borderCell, this.maze.opposite(borderCell));
          yield;

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
        } else {
          return;
        }
      } else {
        // Find the next player
        while (this.state[this.player].current === undefined) {
          this.player = (this.player + 1) % this.parallel;
        }

        const { current, next } = this.step(this.state[this.player]);

        if (next) {
          this.maze.removeWall(current, next.direction);
          yield;

          this.state[this.player].stack.push(current);
          this.state[this.player].current = next;
          this.visited[next.x][next.y] = this.player;

          this.player = (this.player + 1) % this.parallel;
        } else {
          this.state[this.player].current = this.state[this.player].stack.pop();
        }
      }
    }
  }

  private bridge = 1;

  public override addBridge(bridge: CellDirection[]): void {
    const enter = bridge.at(0)!;
    const exit = bridge.at(-1)!;

    const exitCell = this.maze.move(exit, exit.direction)!;
    const enterCell = this.maze.move(enter, this.maze.opposite(enter))!;

    this.maze.removeWall(enterCell, enter.direction);

    const player = this.parallel + ++this.bridge;
    this.visited[enterCell.x][enterCell.y] = player;
    this.visited[exitCell.x][exitCell.y] = player;
  }
}

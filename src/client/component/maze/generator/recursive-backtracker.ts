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
  bridgeMinLength?: number;
  bridgeMaxLength?: number;
  stepsAfterBridge?: number;
  forcedBacktrack?: number;
};

export class RecursiveBacktracker extends MazeGenerator {
  private readonly parallel: number;
  private readonly visited: (false | number)[][];

  public readonly bridgeMinLength: number;
  public readonly bridgeMaxLength: number;
  public readonly stepsAfterBridge: number;
  public readonly forcedBacktrack: number;
  public player: number;
  public state: State[];

  public constructor({
    parallel,
    strategy,
    bridgeMinLength = 1,
    bridgeMaxLength = 1,
    stepsAfterBridge = 1,
    forcedBacktrack = 0,
    ...props
  }: RecursiveBacktrackerProperties) {
    super(props);

    this.parallel = parallel ?? strategy?.length ?? 1;
    this.bridgeMinLength = bridgeMinLength;
    this.bridgeMaxLength = bridgeMaxLength;
    this.stepsAfterBridge = stepsAfterBridge;
    this.forcedBacktrack = forcedBacktrack;

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
    prev: CellDirection;
    next: CellDirection | undefined;
  } {
    const current = state.current!;
    let prev = current;

    let next: CellDirection | undefined;

    if (state.stack.length > 0 && this.random() < this.forcedBacktrack) {
      next = undefined;
    } else {
      switch (state.strategy) {
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

        case 'random': {
          next = this.randomPick(
            this.maze.neighbors(current).filter((c) => this.visited[c.x][c.y] === false),
          );
          break;
        }

        case 'bridge-builder': {
          if (state.bridge.random <= 0) {
            let probe = { ...current };
            const bridge: CellDirection[] = [];

            const turn = this.randomPick(
              this.maze.neighbors(probe).filter((c) => this.visited[c.x][c.y] === false),
            )?.direction;
            if (turn) {
              probe.direction = turn;
            }

            while (true) {
              const [dir] = this.maze.straight(probe, state.bias);
              state.bias = !state.bias;

              const moves = this.maze
                .neighbors(probe)
                .filter(
                  (c) =>
                    this.visited[c.x][c.y] === false && !bridge.some((b) => this.maze.isSame(b, c)),
                );
              const cell = moves.find((c) => c.direction === dir);
              if (cell) {
                bridge.push(cell);
                probe = cell;
              } else {
                next = bridge.pop();
                if (moves.length === 0) {
                  next = bridge.pop();
                }
                break;
              }
            }

            if (bridge.length > this.bridgeMinLength) {
              if (bridge.length > this.bridgeMaxLength) {
                next = bridge[this.bridgeMaxLength];
                bridge.length = this.bridgeMaxLength;
              }

              prev = this.buildBridge(current, bridge);
              for (const span of bridge) {
                this.visited[span.x][span.y] = this.player;
              }

              state.bridge.random = this.stepsAfterBridge;
            } else {
              next = this.randomPick(
                this.maze.neighbors(current).filter((c) => this.visited[c.x][c.y] === false),
              );
            }
          } else {
            state.bridge.random -= 1;

            if (this.random() < this.forcedBacktrack) {
              next = undefined;
            } else {
              const [dir] = this.maze.straight(current, state.bias);
              next = this.randomPick(
                this.maze
                  .neighbors(current)
                  .filter((c) => this.visited[c.x][c.y] === false && c.direction !== dir),
              );
              next ??= this.randomPick(
                this.maze.neighbors(current).filter((c) => this.visited[c.x][c.y] === false),
              );
            }
          }

          break;
        }

        // no default
      }
    }
    return { current, next, prev };
  }

  public *generate(): Generator<void> {
    while (true) {
      // If all players are at the end of their stack, we need to join the segments
      if (this.state.every((s) => s.current === undefined)) {
        const borderCell = this.randomPick(
          this.maze
            .cellsInMaze()
            .filter((c) => this.visited[c.x][c.y] === 0 && !this.maze.nexus(c).bridge)
            .flatMap((c) =>
              this.maze
                .neighbors(c)
                .filter((n) => this.visited[n.x][n.y] !== 0 && !this.maze.nexus(n).bridge),
            ),
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

        const { current, prev, next } = this.step(this.state[this.player]);

        if (next) {
          this.maze.removeWall(prev, next.direction);
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
}

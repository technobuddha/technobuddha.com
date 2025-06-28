import { create2DArray } from '@technobuddha/library';

import {
  type Cell,
  type CellFacing,
  type Direction,
  type Maze,
  type Move,
} from '../geometry/maze.ts';
import { logger } from '../library/logger.ts';
import { Random, type RandomProperties } from '../random/random.ts';

export type Strategy = 'random' | 'right-turn' | 'left-turn' | 'straight' | 'bridge-builder';

type PlayerState = {
  current: CellFacing | undefined;
  strategy: Strategy;
  stack: CellFacing[];
  bias: boolean;
  bridge: {
    random: number;
  };
};

export type MazeGeneratorProperties = RandomProperties & {
  maze: Maze;
  start?: Cell;
  speed?: number;
  bridgeMinLength?: number;
  bridgeMaxLength?: number;
  stepsAfterBridge?: number;
};

export abstract class MazeGenerator extends Random {
  private readonly visited: (false | number)[][];
  protected readonly state: PlayerState[] = [];
  public player = 0;

  public maze: MazeGeneratorProperties['maze'];

  public readonly bridgeMinPieces: number;
  public readonly bridgeMaxPieces: number;
  public readonly stepsAfterBridge: number;

  public forced = 0;

  public readonly speed: number;
  public start: Cell;

  public constructor({
    maze,
    start,
    speed = 5,
    bridgeMinLength = 1,
    bridgeMaxLength = 1,
    stepsAfterBridge = 1,
    random = maze.random,
    ...props
  }: MazeGeneratorProperties) {
    super({ random, ...props });
    this.maze = maze;

    const pieces = this.maze.bridgePieces;
    const min = Math.max(Math.ceil(bridgeMinLength / pieces), 0);
    const max = Math.max(Math.ceil(bridgeMaxLength / pieces), 0);

    this.bridgeMinPieces = min;
    this.bridgeMaxPieces = Math.max(max, min);
    this.stepsAfterBridge = stepsAfterBridge;

    this.visited = create2DArray(this.maze.width, this.maze.height, false);

    this.start = start ?? this.maze.randomCell();
    this.speed = speed;
  }
  //#region Player
  protected createPlayer({
    strategy = 'random',
    start,
  }: { strategy?: Strategy; start?: CellFacing | Cell } = {}): void {
    const current =
      start ?
        'facing' in start ?
          start
        : this.maze.randomCellFacing(start)
      : this.maze.randomCellFacing();

    this.state.push({
      current,
      strategy,
      stack: current ? [current] : [],
      bias: true,
      bridge: {
        random: 1,
      },
    });
  }
  protected moveTo(cell?: CellFacing): void {
    this.state[this.player].current = cell;
  }
  //#region Visitation
  protected isVisited(cell: Cell): boolean {
    return this.visited[cell.x][cell.y] !== false;
  }

  protected isVisitedByMe(cell: Cell, player?: number): boolean {
    return this.visited[cell.x][cell.y] === (player ?? this.player);
  }

  protected visit({ cell, player = this.player }: { cell?: Cell; player?: number } = {}): void {
    const target = cell ?? this.state[player].current;

    if (target) {
      const visitor = this.visited[target.x][target.y];

      if (visitor === false) {
        this.visited[target.x][target.y] = this.player;
      } else if (visitor === this.player) {
        // no-op, already visited by this player
      } else {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.visited.length; ++i) {
          for (let j = 0; j < this.visited[i].length; ++j) {
            if (this.visited[i][j] === visitor) {
              this.visited[i][j] = this.player;
            }
          }
        }
      }
    }
  }
  //#endregion
  //#region Run
  public async *run(): AsyncGenerator<void> {
    this.maze.hookPreGeneration?.(this);
    yield* this.generate();
    this.maze.hookPostGeneration?.(this);
  }

  public abstract generate(): AsyncGenerator<void>;

  protected step(): CellFacing | undefined {
    const state = this.state[this.player];

    if (state.current) {
      // eslint-disable-next-line @typescript-eslint/prefer-destructuring
      const current = state.current;
      let next: Move | undefined;

      if (state.stack.length > 0 && this.randomChance(this.forced)) {
        next = undefined;
      } else {
        switch (state.strategy) {
          case 'right-turn': {
            const turns = this.maze.rightTurn(current);

            [next] = this.maze
              .moves(current, { wall: 'all' })
              .filter(({ move }) => this.visited[move.x][move.y] === false)
              .sort((a, b) => turns.indexOf(a.direction) - turns.indexOf(b.direction));
            break;
          }

          case 'left-turn': {
            const turns = this.maze.leftTurn(current);

            [next] = this.maze
              .moves(current, { wall: 'all' })
              .filter(({ move }) => this.visited[move.x][move.y] === false)
              .sort((a, b) => turns.indexOf(a.direction) - turns.indexOf(b.direction));
            break;
          }

          case 'straight': {
            const turns = this.maze.straight(current, state.bias);
            state.bias = !state.bias;

            [next] = this.maze
              .moves(current, { wall: 'all' })
              .filter(({ move }) => this.visited[move.x][move.y] === false)
              .sort((a, b) => turns.indexOf(a.direction) - turns.indexOf(b.direction));
            break;
          }

          case 'random': {
            next = this.randomPick(
              this.maze
                .moves(current, { wall: 'all' })
                .filter(({ move }) => this.visited[move.x][move.y] === false),
            );
            break;
          }

          case 'bridge-builder': {
            if (state.bridge.random <= 0) {
              const blueprint = this.buildBridge(current);
              if (blueprint) {
                // eslint-disable-next-line @typescript-eslint/prefer-destructuring
                next = blueprint.next;

                const { bridge } = blueprint;
                for (const span of bridge) {
                  this.visited[span.x][span.y] = this.player;
                }

                state.bridge.random = this.stepsAfterBridge;
              } else {
                next = this.randomPick(
                  this.maze
                    .moves(current, { wall: 'all' })
                    .filter(({ move }) => this.visited[move.x][move.y] === false),
                );
              }
            } else {
              state.bridge.random -= 1;

              const [dir] = this.maze.straight(current, state.bias);
              next = this.randomPick(
                this.maze
                  .moves(current, { wall: 'all' })
                  .filter(
                    ({ move, direction }) =>
                      this.visited[move.x][move.y] === false && direction !== dir,
                  ),
              );
              next ??= this.randomPick(
                this.maze
                  .moves(current, { wall: 'all' })
                  .filter(({ move }) => this.visited[move.x][move.y] === false),
              );
            }

            break;
          }

          // no default
        }
      }
      return next?.move;
    }
    throw new Error(`No current cell defined for player ${this.player}.`);
  }
  //#endregion
  //#region Bridge
  protected buildBridge(
    current: CellFacing,
  ): { prev: CellFacing; bridge: CellFacing[]; next: Move } | null {
    const layout = this.randomPick(
      this.maze.bridges(current).filter(({ direction }) => {
        if (direction in this.maze.nexus(current).walls) {
          const cell = this.maze.traverse(current, direction);
          return this.maze.inMaze(cell) && this.visited[cell.x][cell.y] === false;
        }
        return false;
      }),
    );
    if (layout) {
      //logger.log(`Building bridge at ${current.x},${current.y} with layout`, layout);

      const { path, pieces: bridgePieces, connect } = layout;
      const zone = this.maze.cellZone(current);

      const bridge: CellFacing[] = [];
      let probe: Cell = { ...current };
      let index = 0;

      bridgeBuilding: while (true) {
        let direction = path[index++ % path.length];
        if (!(direction in this.maze.nexus(probe).walls)) {
          break;
        }

        const { next, tunnel } = this.maze.walk(probe, direction);
        if (
          !this.maze.inMaze(next) ||
          this.isVisited(next) ||
          this.maze.cellZone(next) !== zone ||
          bridge.some((b) => this.maze.isSame(b, next))
        ) {
          break;
        } else {
          if (tunnel) {
            for (const span of tunnel) {
              const expected = this.maze.traverse(probe, direction);
              if (!this.maze.isIdentical(span, expected)) {
                logger.warn(
                  `Tunnel (${span.x},${span.y}:${span.facing}) does not match (${expected.x},${expected.y}:${expected.facing})`,
                );
                break bridgeBuilding;
              }
              direction = path[index++ % path.length];
              probe = expected;
            }
          }
          bridge.push(next);
          probe = next;
        }
      }

      // while (bridge.length > 0) {
      //   const end = bridge.at(-1)!;
      //   if (
      //     this.maze
      //       .moves(end)
      //       .filter(
      //         ({ move }) =>
      //           this.visited[move.x][move.y] === false &&
      //           !this.maze.nexus(move).bridge &&
      //           !bridge.some((b) => this.maze.isSame(move, b)),
      //       ).length === 0
      //   ) {
      //     bridge.pop();
      //   } else {
      //     break;
      //   }
      // }

      // 'next' is actually the last cell in the bridge
      let pieces = Math.floor((bridge.length - 1) / bridgePieces);
      if (pieces > this.bridgeMinPieces) {
        if (pieces > this.bridgeMaxPieces) {
          pieces = this.bridgeMaxPieces;
        }

        bridge.length = pieces * bridgePieces + 1;

        const next = bridge.pop()!;
        // logger.log(`Building bridge`, [...bridge], { ...next });

        let prev = current;

        const opath = new Set(path);

        const tunnels: { [direction in Direction]?: (CellFacing & { from: CellFacing })[] } = {};
        const xBridge = [prev, ...bridge, next];

        for (const span of bridge) {
          for (const traversal of this.maze
            .traversals(span)
            .filter(
              (t) =>
                !path.includes(t.direction) &&
                !opath.has(t.direction) &&
                xBridge.every((x) => !this.maze.isSame(t.move, x)),
            )) {
            if (!(traversal.direction in tunnels)) {
              tunnels[traversal.direction] = [];
            }
            tunnels[traversal.direction]!.push({ ...traversal.move, from: { ...span } });
          }
          prev = span;
        }

        // logger.log('tunnels)', { ...tunnels });

        let keys: Direction[];
        while ((keys = Object.keys(tunnels) as Direction[]).length > 0) {
          const [key1] = keys;
          const key2 = connect[key1]!;

          if (tunnels[key1]?.length !== tunnels[key2]?.length) {
            logger.warn(`Tunnel length mismatch for ${key1} and ${key2}`, { ...tunnels });
          }

          if (key2 in tunnels) {
            for (let i = 0; i < tunnels[key1]!.length; i++) {
              const t1 = tunnels[key1]![i];
              const t2 = tunnels[key2]![i];

              if (t2) {
                const b1 = t1.from;
                const b2 = t2.from;

                // if (!this.maze.isSame(b1, b2)) {
                //   logger.warn(`tunnel matching from ${b1.x},${b1.y} to ${b2.x},${b2.y}`);
                // }

                const tunnel1 = { x: t1.x, y: t1.y, facing: t1.facing };
                const tunnel2 = { x: t2.x, y: t2.y, facing: t2.facing };

                this.maze.nexus(b1).tunnels[key1] = tunnel2;
                this.maze.nexus(b2).tunnels[key2] = tunnel1;
              }
            }
          }
          delete tunnels[key2];
          delete tunnels[key1];
        }

        // logger.log(
        //   'brige = ',
        //   bridge.map((b) => this.maze.nexus(b)),
        // );

        for (const span of bridge) {
          if (this.maze.nexus(span).bridge) {
            logger.warn(`Bridge already exists at ${span.x},${span.y}`);
          }
          this.maze.nexus(span).bridge = true;
          this.maze.removeWall(span, this.maze.opposite(span.facing));
        }

        return { prev, bridge, next: { direction: this.maze.opposite(next.facing), move: next } };
      }
    }
    return null;
  }
  //#endregion
  //#region Unreachables
  protected fixUnreachables(): void {
    while (true) {
      const { unreachable } = this.maze.analyze({ x: 0, y: 0 });
      if (unreachable.length === 0) {
        break;
      }

      const [cell] = unreachable;
      const hole = this.randomPick(this.maze.moves(cell, { wall: true }));
      if (hole) {
        logger.log(
          `Fixing unreachable cell at ${cell.x},${cell.y} by removing wall ${hole.direction}`,
        );
        this.maze.removeWall(hole.move, hole.direction);
      } else {
        logger.warn(`Masking off unreachable cell at ${cell.x},${cell.y}`);
        this.maze.nexus(cell).mask = true;
      }
    }
  }
  //#endregion
}

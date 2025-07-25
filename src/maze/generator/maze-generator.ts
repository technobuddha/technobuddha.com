import { create2DArray, modulo } from '@technobuddha/library';

import {
  type Cell,
  type CellFacing,
  type Direction,
  type Maze,
  type Move,
} from '../geometry/index.ts';
import { logger } from '../library/logger.ts';
import { Random, type RandomProperties } from '../random/index.ts';

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
  braiding?: number;
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
  public readonly braiding: number;

  public constructor({
    maze,
    start,
    speed = 5,
    braiding = 0,
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
    this.braiding = braiding;
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
  private trouble = false;
  public async *run(): AsyncGenerator<void> {
    // console.clear();
    this.maze.hookPreGeneration?.(this);
    yield* this.generate();
    this.maze.hookPostGeneration?.(this);
    this.finalize();
    // if (this.trouble) {
    // this.maze.draw();
    // yield;
    // debugger;
    // }
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
              .moves(current, { wall: true })
              .filter(({ target }) => this.visited[target.x][target.y] === false)
              .sort((a, b) => turns.indexOf(a.direction) - turns.indexOf(b.direction));
            break;
          }

          case 'left-turn': {
            const turns = this.maze.leftTurn(current);

            [next] = this.maze
              .moves(current, { wall: true })
              .filter(({ target }) => this.visited[target.x][target.y] === false)
              .sort((a, b) => turns.indexOf(a.direction) - turns.indexOf(b.direction));
            break;
          }

          case 'straight': {
            const turns = this.maze.straight(current, state.bias);
            state.bias = !state.bias;

            [next] = this.maze
              .moves(current, { wall: true })
              .filter(({ target }) => this.visited[target.x][target.y] === false)
              .sort((a, b) => turns.indexOf(a.direction) - turns.indexOf(b.direction));
            break;
          }

          case 'random': {
            next = this.randomPick(
              this.maze
                .moves(current, { wall: true })
                .filter(({ target }) => this.visited[target.x][target.y] === false),
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
                    .moves(current, { wall: true })
                    .filter(({ target }) => this.visited[target.x][target.y] === false),
                );
              }
            } else {
              state.bridge.random -= 1;

              const [dir] = this.maze.straight(current, state.bias);
              next = this.randomPick(
                this.maze
                  .moves(current, { wall: true })
                  .filter(
                    ({ target, direction }) =>
                      this.visited[target.x][target.y] === false && direction !== dir,
                  ),
              );
              next ??= this.randomPick(
                this.maze
                  .moves(current, { wall: true })
                  .filter(({ target }) => this.visited[target.x][target.y] === false),
              );
            }

            break;
          }

          // no default
        }
      }
      return next?.target;
    }
    throw new Error(`No current cell defined for player ${this.player}.`);
  }

  public async *braid(): AsyncGenerator<void> {
    if (this.braiding > 0) {
      const deadEnds = this.maze.deadEnds();
      const target = deadEnds.length - Math.floor(this.braiding * deadEnds.length);

      while (deadEnds.length > target) {
        const index = this.randomNumber(deadEnds.length);
        const cell = deadEnds[index];

        deadEnds.splice(index, 1);

        const move = this.randomPick(this.maze.moves(cell, { wall: true }));
        if (move) {
          this.maze.removeWall(cell, move.direction);
          yield;
          const nIndex = deadEnds.findIndex((c) => this.maze.isSame(c, move.target));
          if (nIndex >= 0) {
            deadEnds.splice(nIndex, 1);
          }
        }
      }
    }
  }
  //#endregion
  //#region Bridge
  protected bridgeId = 0;
  protected buildBridge(
    current: CellFacing,
  ): { prev: CellFacing; bridge: CellFacing[]; next: Move } | null {
    this.bridgeId++; // pre-increment will ensure that bridge id is not falsy

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
      const { path, rear, pieces: bridgePieces, connect } = layout;
      const zone = this.maze.cellZone(current);

      // Build a bridge
      const bridge: CellFacing[] = [];
      let probe: Cell = { ...current };
      let index = 0;

      bridgeBuilding: while (true) {
        let direction = path[modulo(index++, path.length)];
        if (!(direction in this.maze.nexus(probe).walls)) {
          break;
        }

        const { target, tunnel } = this.maze.walk(probe, direction);
        if (
          // don't build outside the maze
          !this.maze.inMaze(target) ||
          // or on the edge
          this.maze.moves(target, { wall: 'all', inMaze: false }).length > 0 ||
          // or in another zone
          this.maze.cellZone(target) !== zone ||
          // or if we have already visited it
          this.isVisited(target) ||
          // or if it's already part of our bridge
          bridge.some((b) => this.maze.isSame(b, target))
        ) {
          break;
        }

        // if we go through a tunnel, make sure that the tunnels matches our path
        if (tunnel) {
          for (const span of tunnel) {
            const expected = this.maze.traverse(probe, direction);
            if (!this.maze.isIdentical(span, expected)) {
              break bridgeBuilding;
            }
            direction = path[modulo(index++, path.length)];
            probe = expected;
          }
        }
        bridge.push(target);
        probe = target;
      }

      while (bridge.length > 0) {
        const end = bridge.at(-1)!;
        if (
          this.maze
            .moves(end, { wall: 'all' })
            .filter(
              ({ target }) =>
                this.visited[target.x][target.y] === false &&
                !this.maze.nexus(target).bridge &&
                !bridge.some((b) => this.maze.isSame(target, b)),
            ).length === 0
        ) {
          bridge.pop();
        } else {
          break;
        }
      }

      // 'next' is actually the last cell in the bridge
      let pieces = Math.floor((bridge.length - 1) / bridgePieces);
      if (pieces > this.bridgeMinPieces) {
        if (pieces > this.bridgeMaxPieces) {
          pieces = this.bridgeMaxPieces;
        }

        bridge.length = pieces * bridgePieces + 1;

        const next = bridge.pop()!;
        let prev = current;
        const oPath = new Set([...path, ...rear]);
        const tunnels: { [direction in Direction]?: (CellFacing & { from: CellFacing })[] } = {};
        const xBridge = [prev, ...bridge, next];

        for (const span of bridge) {
          for (const traversal of this.maze
            .traversals(span)
            .filter(
              (t) =>
                !path.includes(t.direction) &&
                !oPath.has(t.direction) &&
                xBridge.every((x) => !this.maze.isSame(t.target, x)),
            )) {
            if (!(traversal.direction in tunnels)) {
              tunnels[traversal.direction] = [];
            }
            tunnels[traversal.direction]!.push({ ...traversal.target, from: { ...span } });
          }
          prev = span;
        }

        const saveTunnels = { ...tunnels };

        let keys: Direction[];
        while ((keys = Object.keys(tunnels) as Direction[]).length > 0) {
          const [key1] = keys;
          const key2 = connect[key1];

          if (key2) {
            if (tunnels[key1]?.length !== tunnels[key2]?.length) {
              this.trouble = true;
              if (tunnels[key1] && tunnels[key2]) {
                logger.error(
                  `@{${current.x},${current.y}} Tunnel length mismatch for ${key1} and ${key2}`,
                  { ...tunnels },
                );
              } else {
                logger.warn(
                  `
                  ${bridge.map((c) => `@{${c.x},${c.y}}`).join(' ')}
                  half-tunnel for ${key1} and ${key2}
                  `,
                  {
                    ...tunnels,
                  },
                  saveTunnels,
                );
              }
            }

            if (key2 in tunnels) {
              for (let i = 0; i < tunnels[key1]!.length; i++) {
                const t1 = tunnels[key1]![i];
                const t2 = tunnels[key2]![i];

                if (t2) {
                  const b1 = t1.from;
                  const b2 = t2.from;

                  const tunnel1 = { x: t1.x, y: t1.y, facing: t1.facing };
                  const tunnel2 = { x: t2.x, y: t2.y, facing: t2.facing };

                  this.maze.nexus(b1).tunnels[key1] = tunnel2;
                  this.maze.nexus(b2).tunnels[key2] = tunnel1;

                  if (!this.maze.isSame(b1, b2)) {
                    this.maze.nexus(b1).via[key1] = [b2];
                    this.maze.nexus(b2).via[key2] = [b1];
                  }
                }
              }
            }
            delete tunnels[key2];
          }
          delete tunnels[key1];
        }

        for (const span of bridge) {
          if (this.maze.nexus(span).bridge) {
            logger.warn(`Bridge already exists at ${span.x},${span.y}`);
          }
          this.maze.nexus(span).bridge = this.bridgeId;
          this.maze.removeWall(span, this.maze.opposite(span.facing));
        }

        return { prev, bridge, next: { direction: this.maze.opposite(next.facing), target: next } };
      }
    }
    return null;
  }
  //#endregion
  //#region finalize
  public finalize(): void {
    const bridges = new Set<number>();

    for (const cell of this.maze.cellsInMaze()) {
      const nexus = this.maze.nexus(cell);
      const { walls, tunnels, bridge } = this.maze.nexus(cell);

      for (const direction of nexus.wallDirections()) {
        // If we have a tunnel under a wall...
        if (bridge && walls[direction] && tunnels[direction]) {
          // If a cell has a tunnel look at the connecting cell
          const cell2 = this.maze.traverse(cell, direction);
          if (this.maze.inMaze(cell2)) {
            const nexus2 = this.maze.nexus(cell2);

            // Check to see if the neighboring cell doesn't have a wall (we have a wall)
            // which means there is a tunnel...
            if (!nexus2.walls[this.maze.opposite(cell2.facing)]) {
              // mark this bridge is active
              bridges.add(bridge);

              // walk down the tunnel and mark all the bridges as active
              const { tunnel } = this.maze.walk(cell2, this.maze.opposite(cell2.facing));
              if (tunnel) {
                for (const span of tunnel) {
                  const { bridge } = this.maze.nexus(span);
                  if (bridge) {
                    bridges.add(bridge);
                  }
                }
              }
            }
          }
        }
      }
    }

    for (const cell of this.maze.cellsInMaze()) {
      const { bridge } = this.maze.nexus(cell);

      if (bridge && bridges.has(bridge)) {
        this.maze.nexus(cell).elevated = true;
      }
    }
  }
  //#endregion
  //#region Unreachables
  protected fixUnreachables(): void {
    // while (true) {
    //   const { unreachable } = this.maze.analyze({ x: 0, y: 0 });
    //   if (unreachable.length === 0) {
    //     break;
    //   }
    //   const [cell] = unreachable;
    //   const hole = this.randomPick(this.maze.moves(cell, { wall: true }));
    //   if (hole) {
    //     logger.log(
    //       `Fixing unreachable cell at ${cell.x},${cell.y} by removing wall ${hole.direction}`,
    //     );
    //     this.maze.removeWall(hole.target, hole.direction);
    //   } else {
    //     logger.warn(`Masking off unreachable cell at ${cell.x},${cell.y}`);
    //     this.maze.nexus(cell).mask = true;
    //   }
    // }
  }
  //#endregion
}

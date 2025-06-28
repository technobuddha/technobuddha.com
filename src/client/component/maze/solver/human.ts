/* eslint-disable @typescript-eslint/no-loop-func */
import { create2DArray, modulo } from '@technobuddha/library';

import {
  type Cell,
  type CellFacing,
  type CellTunnel,
  type Direction,
  type Facing,
} from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type Options = {
  readonly finalDestination: boolean;
  readonly markVisited: boolean;
  readonly markDeadEnds: boolean;
  readonly hideReverse: boolean;
};

type CellPath = Cell & {
  readonly direction: Direction;
  readonly facing: Facing;
  readonly branch: Direction;
  readonly path: CellTunnel[];
  readonly history: CellFacing[];
};
export type HumanProperties = MazeSolverProperties & {
  readonly options?: Partial<Options>;
};

export class Human extends MazeSolver {
  public options: Options;

  protected readonly visited: boolean[][];
  protected readonly deadEnd: boolean[][];

  public constructor({ options, ...props }: HumanProperties) {
    super(props);

    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.deadEnd = create2DArray(this.maze.width, this.maze.height, false);

    this.options = {
      finalDestination: true,
      markVisited: true,
      markDeadEnds: true,
      hideReverse: true,
      ...options,
    };
    this.keyHandler = this.intializeKeyboardHandler();
  }

  //#region Keyboard Handler
  private readonly keyHandler: (event: KeyboardEvent) => void;

  private intializeKeyboardHandler(): (event: KeyboardEvent) => void {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handler = (event: KeyboardEvent): void => {
      this.dispatchEvent(new CustomEvent('keydown', { detail: event.key }));
    };
    document.addEventListener('keydown', handler);
    return handler;
  }

  private async captureKey(): Promise<string> {
    const ac = new AbortController();
    this.addTrash(ac);

    return new Promise((resolve, reject) => {
      const onAbort = (_event: Event): void => {
        ac.signal.removeEventListener('abort', onAbort);
        this.removeTrash(ac);
        reject(new Error('Key capture aborted'));
      };

      const onKeyDown = (event: Event): void => {
        this.removeTrash(ac);
        resolve((event as CustomEvent).detail);
      };

      ac.signal.addEventListener('abort', onAbort);
      this.addEventListener('keydown', onKeyDown);
    });
  }
  //#endregion

  private destinations(cell: CellFacing): CellPath[] {
    type Destination = Cell & {
      direction: Direction;
      facing: Facing;
      readonly branch: Direction;
      readonly history: CellFacing[];
    };

    const toCellPath = (destination: Destination): CellPath => ({
      ...destination,
      path: this.maze.makePath(destination.history),
    });

    const destinations: Destination[] = this.maze.moves(cell, { wall: false }).map((move) => ({
      ...move.move,
      direction: move.direction,
      branch: move.direction,
      history: [move.move],
    }));

    const cellPaths: CellPath[] = [];

    for (const destination of destinations) {
      let prev = cell;

      while (true) {
        const next = this.maze
          .moves(destination, { wall: false })
          .filter(({ move: m }) => !this.deadEnd[m.x][m.y] && !this.maze.isSame(m, prev));

        if (next.length === 0) {
          // dead end
          if (this.maze.isSame(destination, this.maze.exit)) {
            cellPaths.push(toCellPath(destination));
          } else if (this.options.markDeadEnds) {
            for (const h of destination.history) {
              this.deadEnd[h.x][h.y] = true;
              if (!this.maze.isSame(h, this.maze.entrance)) {
                this.maze.drawX(this.maze.drawCell(h));
              }
            }

            this.deadEnd[destination.x][destination.y] = true;
            if (!this.maze.isSame(destination, this.maze.entrance)) {
              this.maze.drawX(this.maze.drawCell(destination));
            }
          } else {
            destination.history.push(destination);
          }
          break;
        } else if (next.length === 1) {
          // single path
          if (this.options.finalDestination) {
            prev = { x: destination.x, y: destination.y, facing: destination.facing };
            destination.history.push(next[0].move);
            destination.x = next[0].move.x;
            destination.y = next[0].move.y;
            destination.facing = next[0].move.facing;
            destination.direction = next[0].direction;
          } else {
            cellPaths.push(toCellPath(destination));
            break;
          }
        } else {
          // destination.path.push(destination);
          cellPaths.push(toCellPath(destination));
          break;
        }
      }
    }

    return cellPaths;
  }

  private restoreCell(cell: Cell): void {
    this.maze.drawCell(cell);
    if (this.deadEnd[cell.x][cell.y]) {
      this.maze.drawX(this.maze.drawCell(cell), 'red');
    } else if (this.visited[cell.x][cell.y]) {
      this.maze.drawAvatar(this.maze.drawCell(cell), '#444444');
    }
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    const history: CellFacing[] = [entrance];
    let human: CellFacing = entrance;
    let reverse = human;
    let destinations: CellPath[] = [];
    let choice = 0;
    let bias = true;

    while (!this.maze.isSame(human, exit)) {
      for (const move of destinations) {
        for (const subMove of move.path) {
          this.restoreCell(subMove);
        }
        this.restoreCell(move);
      }
      this.restoreCell(reverse);

      destinations = this.destinations(human);

      const turns = this.maze.straight(this.maze.isSame(human, entrance) ? entrance : human, bias);
      bias = !bias;

      if (this.options.hideReverse && destinations.length > 1) {
        destinations = destinations.filter((c) => !this.maze.isSame(c, reverse));
      }
      destinations = destinations.sort(
        (a, b) =>
          (this.visited[a.x][a.y] ? 1 : 0) - (this.visited[b.x][b.y] ? 1 : 0) ||
          turns.indexOf(a.branch) - turns.indexOf(b.branch),
      );

      choice = 0;

      for (const move of destinations) {
        for (const subMove of move.path) {
          this.restoreCell(subMove);
        }
        this.maze.drawPaths(move.path);
      }

      this.maze.drawStar(human, this.maze.avatarColor);
      yield;

      makeChoice: while (true) {
        for (const move of destinations) {
          this.maze.drawAvatar(
            this.maze.drawCell(move),
            this.maze.isSame(move, destinations[choice]) ? 'lime' : 'yellow',
          );
        }

        try {
          const key = await this.captureKey();

          switch (key) {
            case 'ArrowUp':
            case ' ': {
              // eslint-disable-next-line require-atomic-updates
              reverse = human;

              const { x, y, facing } = destinations[choice];
              human = { x, y, facing };

              for (const path of destinations[choice].path) {
                if (this.options.markVisited && !path.tunnel) {
                  this.visited[path.x][path.y] = true;
                }
              }
              history.push(...destinations[choice].history);
              if (this.options.markVisited) {
                this.visited[human.x][human.y] = true;
              }
              break makeChoice;
            }

            case 'ArrowRight': {
              choice = modulo(choice + 1, destinations.length);
              break;
            }

            case 'ArrowLeft': {
              choice = modulo(choice - 1, destinations.length);
              break;
            }

            case 'ArrowDown': {
              human = history.pop() ?? human;
              break makeChoice;
            }

            // no default
          }
        } catch {
          break;
        }
      }
    }

    this.maze.solution = this.maze.makePath(this.maze.flatten(history));
  }

  public override dispose(): void {
    super.dispose();
    document.removeEventListener('keydown', this.keyHandler);
  }
}

/* eslint-disable @typescript-eslint/no-loop-func */
import { create2DArray, modulo } from '@technobuddha/library';

import {
  type Cell,
  type CellDirection,
  type CellTunnel,
  type Direction,
} from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type Options = {
  readonly finalDestination: boolean;
  readonly markVisited: boolean;
  readonly markDeadEnds: boolean;
  readonly hideReverse: boolean;
};

type CellPath = CellDirection & {
  readonly branch: Direction;
  readonly path: CellTunnel[];
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
  private destinations(cell: Cell): CellPath[] {
    const moves: CellPath[] = this.maze.moves(cell, { wall: false }).map((move) => ({
      ...move.move,
      direction: move.direction,
      branch: move.direction,
      path: [],
    }));

    const paths: CellPath[] = [];

    for (const move of moves) {
      let prev = cell;

      const exploreTunnel = (): void => {
        const { tunnel } = this.maze.walk(prev, move.direction);
        if (tunnel) {
          for (const t of tunnel) {
            move.path.push({ ...t, tunnel: true });
          }
        }
      };

      while (true) {
        const next = this.maze
          .moves(move, { wall: false })
          .filter(({ move: m }) => !this.deadEnd[m.x][m.y] && !this.maze.isSame(m, prev));

        if (next.length === 0) {
          // dead end
          if (this.maze.isSame(move, this.maze.exit)) {
            paths.push(move);
          } else if (this.options.markDeadEnds) {
            for (const p of move.path) {
              if (!p.tunnel) {
                this.deadEnd[p.x][p.y] = true;
                if (!this.maze.isSame(p, this.maze.entrance)) {
                  this.maze.drawX(this.maze.drawCell(p));
                }
              }
            }
            this.deadEnd[move.x][move.y] = true;
            if (!this.maze.isSame(move, this.maze.entrance)) {
              this.maze.drawX(this.maze.drawCell(move));
            }
          } else if (!this.deadEnd[move.x][move.y]) {
            exploreTunnel();
            paths.push(move);
          }
          break;
        } else if (next.length === 1) {
          // single path
          exploreTunnel();
          if (this.options.finalDestination) {
            prev = { x: move.x, y: move.y };
            move.path.push({ x: move.x, y: move.y, direction: move.direction, tunnel: false });
            move.x = next[0].move.x;
            move.y = next[0].move.y;
            move.direction = next[0].direction;
          } else {
            paths.push(move);
            break;
          }
        } else {
          exploreTunnel();

          paths.push(move);
          break;
        }
      }
    }

    return paths;
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
  } = {}): AsyncIterator<void> {
    const history: CellTunnel[] = [];
    let human: CellDirection = entrance;
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

      const turns = this.maze.straight(
        this.maze.isSame(human, entrance) ?
          { ...entrance, direction: this.maze.opposite(entrance) }
        : human,
        bias,
      );
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
      }

      for (const move of destinations) {
        let prev: CellTunnel | null = null;
        for (const subMove of move.path) {
          if (prev) {
            this.maze.drawPath(
              { ...prev, direction: subMove.direction },
              prev.tunnel ? this.maze.tunnelColor : this.maze.pathColor,
            );
          }
          prev = subMove;
        }
        if (prev) {
          this.maze.drawPath(
            { ...prev, direction: move.direction },
            prev.tunnel ? this.maze.tunnelColor : this.maze.pathColor,
          );
        }
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
              human = destinations[choice];

              for (const path of destinations[choice].path) {
                history.push(path);
                if (this.options.markVisited && !path.tunnel) {
                  this.visited[path.x][path.y] = true;
                }
              }
              history.push({ x: human.x, y: human.y, direction: human.direction, tunnel: false });
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

    this.maze.solution = [];
    const solution = this.maze.flatten(history.filter((c) => !c.tunnel));

    let prev = this.maze.entrance;
    for (const cell of solution) {
      this.maze.solution.push({ x: prev.x, y: prev.y, direction: cell.direction });
      prev = cell;
    }
  }

  public override dispose(): void {
    super.dispose();
    document.removeEventListener('keydown', this.keyHandler);
  }
}

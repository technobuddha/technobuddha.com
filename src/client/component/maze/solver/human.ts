/* eslint-disable @typescript-eslint/no-loop-func */
import { create2DArray, modulo } from '@technobuddha/library';

import { type Cell, type CellDirection, type Direction } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type HumanProperties = MazeSolverProperties;

type CellTunnel = CellDirection & { tunnel: boolean };

type CellPath = CellDirection & {
  branch: Direction;
  path: CellTunnel[];
};

export class Human extends MazeSolver {
  private readonly keyHandler: (event: KeyboardEvent) => void;
  private readonly visited: boolean[][];
  private readonly deadEnd: boolean[][];

  public constructor(props: HumanProperties) {
    super(props);
    this.visited = create2DArray(this.maze.width, this.maze.height, false);
    this.deadEnd = create2DArray(this.maze.width, this.maze.height, false);

    this.keyHandler = (event: KeyboardEvent): void => {
      this.dispatchEvent(new CustomEvent('keydown', { detail: event.key }));
    };
    document.addEventListener('keydown', this.keyHandler);
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
          } else if (this.random() < 1) {
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
          } else {
            exploreTunnel();
            paths.push(move);
          }
          break;
        } else if (next.length === 1) {
          // single path
          if (this.random() < 1) {
            exploreTunnel();

            prev = { x: move.x, y: move.y };
            move.path.push({ x: move.x, y: move.y, direction: move.direction, tunnel: false });
            move.x = next[0].move.x;
            move.y = next[0].move.y;
            move.direction = next[0].direction;
          } else {
            exploreTunnel();

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
    const history: CellDirection[] = [];
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

      if (this.random() < 1 && destinations.length > 1) {
        destinations = destinations.filter((c) => !this.maze.isSame(c, reverse));
      }

      const turns = this.maze.straight(
        this.maze.isSame(human, entrance) ?
          { ...entrance, direction: this.maze.opposite(entrance) }
        : human,
        bias,
      );
      bias = !bias;

      destinations = destinations.sort((a, b) => turns.indexOf(a.branch) - turns.indexOf(b.branch));
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
              history.push(human);
              // eslint-disable-next-line require-atomic-updates
              reverse = human;
              human = destinations[choice];

              this.visited[human.x][human.y] = true;
              for (const path of destinations[choice].path) {
                this.visited[path.x][path.y] = true;
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
  }

  public override dispose(): void {
    super.dispose();
    document.removeEventListener('keydown', this.keyHandler);
  }
}

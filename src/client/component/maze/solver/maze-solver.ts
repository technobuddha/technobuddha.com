import { type CellFacing, type Maze } from '../geometry/maze.ts';
import { Random, type RandomProperties } from '../random/random.ts';

type Trash = AbortController;

export type MazeSolverProperties = RandomProperties & {
  readonly maze: Maze;
  readonly speed?: number;
};

export type SolveArguments = {
  readonly color?: string;
  readonly entrance?: CellFacing;
  readonly exit?: CellFacing;
};

export abstract class MazeSolver extends Random implements Disposable {
  public readonly speed: NonNullable<MazeSolverProperties['speed']>;
  protected readonly maze: MazeSolverProperties['maze'];
  protected readonly trash = new Set<Trash>();

  public constructor({ maze, speed = 1, random = maze.random, ...props }: MazeSolverProperties) {
    super({ random, ...props });
    this.maze = maze;
    this.speed = speed;
  }

  //#region Trash
  protected addTrash(controller: Trash): void {
    this.trash.add(controller);
  }

  protected removeTrash(controller: Trash): void {
    this.trash.delete(controller);
  }

  public dispose(): void {
    for (const trash of this.trash) {
      trash.abort();
    }
    this.trash.clear();
  }

  public [Symbol.dispose](): void {
    this.dispose();
  }
  //#endregion

  public abstract solve(args?: SolveArguments): AsyncGenerator<void>;
}

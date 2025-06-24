import { type CellDirection, type Maze } from '../../geometry/maze.ts';

export type RobotProperties = {
  maze: Maze;
  location: CellDirection;
};

export abstract class Robot implements Disposable {
  public readonly maze: Maze;
  public readonly history: CellDirection[];
  public location: CellDirection;

  public constructor({ maze, location }: RobotProperties) {
    this.maze = maze;
    this.location = location;

    this.history = [location];
  }

  public abstract execute(): void;

  public dispose(): void {
    //
  }

  protected previousLocation(): CellDirection | undefined {
    return this.history.at(-2);
  }

  public [Symbol.dispose](): void {
    this.dispose();
  }
}

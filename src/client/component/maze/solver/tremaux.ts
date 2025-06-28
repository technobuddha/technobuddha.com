import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import { TremauxRobot } from './robot/tremaux-robot.ts';

export type TremauxProperties = MazeSolverProperties & {
  avatarColor?: string;
  pathColor?: string;
  blockedColor?: string;
};

export class Tremaux extends MazeSolver {
  public avatarColor: string;
  public pathColor: string;
  public blockedColor: string;

  public constructor({
    maze,
    avatarColor = maze.avatarColor,
    pathColor = maze.pathColor,
    blockedColor = maze.blockedColor,
    ...props
  }: TremauxProperties) {
    super({ maze, ...props });
    this.avatarColor = avatarColor;
    this.pathColor = pathColor;
    this.blockedColor = blockedColor;
  }

  public async *solve({
    markedColor = this.pathColor,
    blockedColor = this.blockedColor,
    avatarColor = this.avatarColor,
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    using robot = new TremauxRobot({
      maze: this.maze,
      location: entrance,
      color: avatarColor,
      pathColor: markedColor,
      blockedColor: blockedColor,
    });

    while (!this.maze.isSame(robot.location, exit)) {
      robot.execute();
      yield;
    }

    this.maze.solution = this.maze.makePath(robot.path());
  }
}

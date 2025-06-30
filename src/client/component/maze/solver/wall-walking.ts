import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import { WallWalkingRobot } from './robot/index.ts';

export type WallWalkingProperties = MazeSolverProperties & {
  turn?: 'right' | 'left';
  avatarColor?: string;
};

export class WallWalking extends MazeSolver {
  private readonly avatarColor: string;
  private readonly turn: 'right' | 'left';

  public constructor({
    maze,
    avatarColor = maze.avatarColor,
    turn,
    ...props
  }: WallWalkingProperties) {
    super({ maze, ...props });

    this.avatarColor = avatarColor;
    this.turn = turn ?? (this.randomChance(0.5) ? 'left' : 'right');
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
    avatarColor = this.avatarColor,
  } = {}): AsyncGenerator<void> {
    const robot = new WallWalkingRobot({
      location: entrance,
      maze: this.maze,
      turn: this.turn,
      color: avatarColor,
      trails: 15,
    });

    while (!this.maze.isSame(robot.location, exit)) {
      robot.execute();
      yield;
    }

    this.maze.solution = this.maze.makePath(robot.path());
  }
}

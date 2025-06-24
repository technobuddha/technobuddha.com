import { create2DArray } from '@technobuddha/library';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import { WallWalkingRobot } from './robot/wall-walking-robot.ts';

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
    this.turn = turn ?? (this.random() < 0.5 ? 'left' : 'right');
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

    const visits: number[][] = create2DArray(this.maze.width, this.maze.height, 0);

    while (!this.maze.isSame(robot.location, exit)) {
      const v = ++visits[robot.location.x][robot.location.y];
      if (v > Object.keys(this.maze.nexus(robot.location).walls).length) {
        throw new Error('Loop detected');
      }

      robot.execute();
      yield;
    }

    this.maze.solution = this.maze.flatten(this.maze.makePath(robot.history));
  }
}

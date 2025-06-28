import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import { BacktrackingRobot, type BacktrackingRobotProperties } from './robot/backtracking-robot.ts';
import { type Robot } from './robot/robot.ts';
import { TremauxRobot, type TremauxRobotProperties } from './robot/tremaux-robot.ts';
import { WallWalkingRobot, type WallWalkingRobotProperties } from './robot/wall-walking-robot.ts';

type TremauxRobo = Omit<TremauxRobotProperties, 'maze' | 'location'> & {
  algorithm: 'tremaux';
};

type WallWalkingRobo = Omit<WallWalkingRobotProperties, 'maze' | 'location'> & {
  algorithm: 'wall-walking';
};

type BacktrackingRobo = Omit<BacktrackingRobotProperties, 'maze' | 'location'> & {
  algorithm: 'backtracking';
};

type Robo = TremauxRobo | WallWalkingRobo | BacktrackingRobo;

export type RobotoProperties = MazeSolverProperties & {
  robots: Robo[];
};

export class Roboto extends MazeSolver {
  private readonly robos: Robo[];

  public constructor({ maze, robots, ...props }: RobotoProperties) {
    super({ maze, ...props });
    this.robos = robots;
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    const robots: Robot[] = this.robos.map((robo) => {
      switch (robo.algorithm) {
        case 'tremaux': {
          return new TremauxRobot({
            maze: this.maze,
            location: entrance,
            ...robo,
          });
        }

        case 'wall-walking': {
          return new WallWalkingRobot({
            maze: this.maze,
            location: entrance,
            ...robo,
          });
        }

        case 'backtracking': {
          return new BacktrackingRobot({
            maze: this.maze,
            location: entrance,
            ...robo,
          });
        }

        // no default
      }
    });

    while (!robots.some((robot) => this.maze.isSame(robot.location, exit))) {
      for (const robot of robots) {
        robot.execute();
        yield;
      }
    }

    const winner = robots.find((robot) => this.maze.isSame(robot.location, exit))!;

    console.log(winner.name);
    this.maze.solution = this.maze.makePath(winner.path());
  }
}

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import {
  BacktrackingRobot,
  type BacktrackingRobotProperties,
  RandomMouseRobot,
  type RandomMouseRobotProperties,
  type Robot,
  TremauxRobot,
  type TremauxRobotProperties,
  WallWalkingRobot,
  type WallWalkingRobotProperties,
} from './robot/index.ts';

type TremauxRobo = Omit<TremauxRobotProperties, 'maze' | 'location'> & {
  algorithm: 'tremaux';
};

type WallWalkingRobo = Omit<WallWalkingRobotProperties, 'maze' | 'location'> & {
  algorithm: 'wall-walking';
};

type BacktrackingRobo = Omit<BacktrackingRobotProperties, 'maze' | 'location'> & {
  algorithm: 'backtracking';
};

type RandomMouseRobo = Omit<RandomMouseRobotProperties, 'maze' | 'location'> & {
  algorithm: 'random-mouse';
};

type Robo = TremauxRobo | WallWalkingRobo | BacktrackingRobo | RandomMouseRobo;

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

        case 'random-mouse': {
          return new RandomMouseRobot({
            maze: this.maze,
            location: entrance,
            ...robo,
          });
        }

        // no default
      }
    });

    while (
      robots.some((robot) => robot.active) &&
      !robots.some((robot) => this.maze.isSame(robot.location, exit))
    ) {
      for (const robot of robots) {
        robot.execute();
        yield;
      }
    }

    if (robots.every((robot) => !robot.active)) {
      this.maze.sendMessage('All robots are stuck');
    } else {
      const winners = robots.filter((robot) => this.maze.isSame(robot.location, exit));
      const [winner] = winners;

      if (robots.length > 1) {
        if (winners.length === 1) {
          this.maze.sendMessage(`Robot ${winner.name} wins`, winner.color);
        } else if (winners.length > 1) {
          this.maze.sendMessage(`Robots ${winners.map((r) => r.name).join(', ')} tie`);
        }
      }

      this.maze.solution = this.maze.makePath(winner.path());
    }
  }
}

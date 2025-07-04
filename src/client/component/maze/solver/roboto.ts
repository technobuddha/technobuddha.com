import { type CellFacing } from '#componentmaze/geometry';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import { DrunkenRobot, type DrunkenRobotProperties } from './robot/drunken-robot.ts';
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
import { RobotError } from './robot/robot-error.ts';

type RoboProperties<Algorithm extends string, Properties> = Omit<
  Properties,
  'maze' | 'location'
> & {
  algorithm: Algorithm;
};

export type Robo =
  | RoboProperties<'tremaux', TremauxRobotProperties>
  | RoboProperties<'wall-walking', WallWalkingRobotProperties>
  | RoboProperties<'backtracking', BacktrackingRobotProperties>
  | RoboProperties<'random-mouse', RandomMouseRobotProperties>
  | RoboProperties<'drunkards-walk', DrunkenRobotProperties>;

export type RobotoProperties = MazeSolverProperties & {
  robots: Robo[];
};

export class Roboto extends MazeSolver {
  private readonly robos: Robo[] = [];
  protected readonly robots: Robot[] = [];

  public constructor({ maze, robots, ...props }: RobotoProperties) {
    super({ maze, ...props });
    this.robos = robots;
  }

  protected createRobot(robo: Robo, location: CellFacing): Robot {
    switch (robo.algorithm) {
      case 'tremaux': {
        return new TremauxRobot({ maze: this.maze, location, ...robo });
      }

      case 'wall-walking': {
        return new WallWalkingRobot({ maze: this.maze, location, ...robo });
      }

      case 'backtracking': {
        return new BacktrackingRobot({ maze: this.maze, location, ...robo });
      }

      case 'random-mouse': {
        return new RandomMouseRobot({ maze: this.maze, location, ...robo });
      }

      case 'drunkards-walk': {
        return new DrunkenRobot({ maze: this.maze, location, ...robo });
      }

      // no default
    }
  }

  protected runOneRobot(robot: Robot): void {
    try {
      robot.execute();
    } catch (error) {
      if (error instanceof RobotError) {
        this.maze.sendMessage(error.message, error.color);
      } else {
        this.maze.sendMessage(`${robot.name} encountered an error: ${error}`);
      }
      this.killOneRobot(robot);
    }
  }

  protected runAllRobots(): void {
    for (const robot of Array.from(this.robots)) {
      this.runOneRobot(robot);
    }
  }

  protected killAllRobots(): void {
    let robot: Robot | undefined;
    while ((robot = this.robots.pop())) {
      robot.dispose();
    }
  }

  protected killOneRobot(robot: Robot): void {
    const index = this.robots.indexOf(robot);
    if (index >= 0) {
      this.robots.splice(index, 1);
    } else {
      this.maze.sendMessage(`${robot.name} body not found`);
    }
    robot.dispose();
  }

  protected activateOneRobot(robot: Robot): void {
    this.robots.push(robot);
  }

  protected isProgramComplete(robot: Robot, exit = this.maze.exit): boolean {
    return this.maze.isSame(robot.location, exit);
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    this.killAllRobots();
    for (const robo of this.robos) {
      this.activateOneRobot(this.createRobot(robo, entrance));
    }

    while (!this.robots.some((robot) => this.isProgramComplete(robot, exit))) {
      this.runAllRobots();
      yield;
    }

    if (this.robots.length === 0) {
      if (this.robos.length > 0) {
        this.maze.sendMessage('no solution found');
      }
    } else {
      const winners = this.robots.filter((robot) => this.isProgramComplete(robot));
      const [winner] = winners;

      if (this.robos.length > 1) {
        if (winners.length === 1) {
          this.maze.sendMessage(`${winner.name} wins`, winner.color);
        } else if (winners.length > 1) {
          this.maze.sendMessage(`${winners.map((r) => r.name).join(', ')} tie`, 'white');
        }
      }

      this.maze.solution = this.maze.makePath(winner.path());
    }
  }
}

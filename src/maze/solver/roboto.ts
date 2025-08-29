import { conjoin, MersenneTwister, ordinal } from '@technobuddha/library';

import { type CellFacing } from '../geometry/index.ts';
import { mix } from '../library/index.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import { DrunkenRobot, type DrunkenRobotProperties } from './robot/drunkards-walk.ts';
import {
  BacktrackingRobot,
  type BacktrackingRobotProperties,
  DijkstrasRobot,
  type DijkstrasRobotProperties,
  PledgeRobot,
  type PledgeRobotProperties,
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
  | RoboProperties<'backtracking', BacktrackingRobotProperties>
  | RoboProperties<'dijkstras', DijkstrasRobotProperties>
  | RoboProperties<'drunkards-walk', DrunkenRobotProperties>
  | RoboProperties<'pledge', PledgeRobotProperties>
  | RoboProperties<'random-mouse', RandomMouseRobotProperties>
  | RoboProperties<'tremaux', TremauxRobotProperties>
  | RoboProperties<'wall-walking', WallWalkingRobotProperties>;

export type RobotoProperties = MazeSolverProperties & {
  robots: Robo[];
};

export class Roboto extends MazeSolver {
  private readonly seed = Math.floor(Math.random() * 0x7fffffff);
  private readonly robos: Robo[] = [];
  protected readonly robots: Robot[] = [];

  public constructor({ maze, robots, ...props }: RobotoProperties) {
    super({ maze, ...props });
    this.robos = robots;
  }

  protected createRobot(robo: Robo, location: CellFacing): Robot {
    // Ensure that all robots use the same random numbers.
    const rng = new MersenneTwister(this.seed);
    // cspell:ignore genrand
    const random = rng.genrandReal3.bind(rng);

    switch (robo.algorithm) {
      case 'tremaux': {
        return new TremauxRobot({ random, maze: this.maze, location, ...robo });
      }

      case 'wall-walking': {
        return new WallWalkingRobot({ random, maze: this.maze, location, ...robo });
      }

      case 'backtracking': {
        return new BacktrackingRobot({ random, maze: this.maze, location, ...robo });
      }

      case 'random-mouse': {
        return new RandomMouseRobot({ random, maze: this.maze, location, ...robo });
      }

      case 'drunkards-walk': {
        return new DrunkenRobot({ random, maze: this.maze, location, ...robo });
      }

      case 'dijkstras': {
        return new DijkstrasRobot({ random, maze: this.maze, location, ...robo });
      }

      case 'pledge': {
        return new PledgeRobot({ random, maze: this.maze, location, ...robo });
      }

      // no default
    }
  }

  protected runOneRobot(robot: Robot): void {
    try {
      robot.execute();
    } catch (error) {
      if (error instanceof RobotError) {
        this.maze.sendMessage(error.message, { color: error.color });
      } else {
        this.maze.sendMessage(`${robot.name} encountered an error: ${error}`, { level: 'error' });
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
      this.maze.sendMessage(`${robot.name} body not found`, { level: 'warning' });
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
    const players = this.robos.length;
    let place = 0;

    this.killAllRobots();
    for (const robo of this.robos) {
      this.activateOneRobot(this.createRobot(robo, entrance));
    }

    while (this.robots.length > 0) {
      this.runAllRobots();
      yield;

      const winners = this.robots.filter((robot) => this.isProgramComplete(robot, exit));
      if (winners.length > 0) {
        const [winner] = winners;

        if (place === 0) {
          this.maze.solution = this.maze.makePath(winner.path());
        }

        if (players > 1) {
          if (winners.length === 1) {
            this.maze.sendMessage(`${winner.name} takes ${ordinal(++place)} place`, {
              color: winner.color,
            });
          } else if (winners.length > 1) {
            this.maze.sendMessage(
              // eslint-disable-next-line @typescript-eslint/no-loop-func
              `${winners.map((r) => r.name).join(', ')} tie for ${conjoin(winners.map(() => ordinal(++place)))} places`,
              {
                color: mix(winners[0].color, winners[1].color),
              },
            );
          }
        } else {
          ++place;
        }

        for (const winner of winners) {
          this.killOneRobot(winner);
        }
      }
    }

    if (place === 0 && this.robots.length === 0) {
      if (this.robos.length > 0) {
        this.maze.sendMessage('No solution found', { level: 'warning' });
      }
    }
  }
}

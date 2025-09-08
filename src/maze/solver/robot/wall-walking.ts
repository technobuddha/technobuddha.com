import { create2dArray } from '@technobuddha/library';

import { Robot, type RobotProperties } from './robot.ts';
import { RobotError } from './robot-error.ts';

export type WallWalkingRobotProperties = Omit<RobotProperties, 'program'> & {
  turn: 'right' | 'left';
};

export class WallWalkingRobot extends Robot {
  public readonly algorithm = 'wall-walking';
  private readonly visits: number[][];

  public constructor({ turn = 'right', ...props }: WallWalkingRobotProperties) {
    const program = turn === 'right' ? 'right-wall' : 'left-wall';
    super({ program, ...props });
    this.visits = create2dArray(this.maze.width, this.maze.height, 0);
  }

  public execute(): void {
    const v = ++this.visits[this.location.x][this.location.y];
    if (v > Object.keys(this.maze.nexus(this.location).walls).length) {
      throw new RobotError(`${this.name} is stuck in a loop.`, this.color);
    }

    const next = this.decide(this.maze.moves(this.location, { wall: false }));
    if (next) {
      this.moveTo(next.target);
    } else {
      throw new RobotError(`${this.name} cannot decide on a move`, this.color);
    }
  }
}

import { create2DArray } from '@technobuddha/library';

import { Robot, type RobotProperties } from './robot.ts';
import { RobotError } from './robot-error.ts';

export type WallWalkingRobotProperties = RobotProperties & {
  turn: 'right' | 'left';
};

export class WallWalkingRobot extends Robot {
  public algorithm = 'wall-walking';
  private readonly visits: number[][];

  public constructor({ turn = 'right', ...props }: WallWalkingRobotProperties) {
    const program = turn === 'right' ? 'right-turn' : 'left-turn';
    super({ program, ...props });
    this.visits = create2DArray(this.maze.width, this.maze.height, 0);
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

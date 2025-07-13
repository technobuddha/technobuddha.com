import { Robot, type RobotProperties } from './robot.ts';
import { RobotError } from './robot-error.ts';

export type DrunkenRobotProperties = Omit<RobotProperties, 'program'>;

export class DrunkenRobot extends Robot {
  public readonly algorithm = 'drunkards-walk';

  public constructor({ maze, ...props }: DrunkenRobotProperties) {
    super({ maze, program: 'random', ...props });
  }

  public override get name(): string {
    return this.algorithm;
  }

  public execute(): void {
    const next = this.decide(this.maze.moves(this.location, { wall: false }));
    if (next) {
      this.moveTo(next.target);
    } else {
      throw new RobotError(`${this.name} cannot move`, this.color);
    }
  }
}

import { Robot, type RobotProperties } from './robot.ts';

export type RandomMouseRobotProperties = Omit<RobotProperties, 'program'>;

export class RandomMouseRobot extends Robot {
  public algorithm = 'random-mouse';

  public constructor({ maze, ...props }: RandomMouseRobotProperties) {
    super({ maze, program: 'random', ...props });
  }

  public override get name(): string {
    return this.algorithm;
  }

  public execute(): void {
    const next =
      this.decide(
        this.maze
          .moves(this.location, { wall: false })
          .filter((move) => !this.maze.isSame(move.target, this.previous)),
      )?.target ?? this.previous;
    this.moveTo(next);
  }
}

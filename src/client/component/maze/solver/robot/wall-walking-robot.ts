import { Robot, type RobotProperties } from './robot.ts';

export type WallWalkingRobotProperties = RobotProperties & {
  turn: 'right' | 'left';
  color?: string;
};

export class WallWalkingRobot extends Robot {
  public constructor({ maze, turn = 'right', ...props }: WallWalkingRobotProperties) {
    super({ maze, program: turn === 'right' ? 'right-turn' : 'left-turn', ...props });
  }

  public execute(): void {
    this.clearCell(this.location);

    const next = this.decide(this.maze.moves(this.location, { wall: false }), this.location);
    if (next) {
      this.moveTo(next.move);
    } else {
      throw new Error(`WallWalkingRobot cannot move from ${this.location.x},${this.location.y}`);
    }
  }

  public override dispose(): void {
    if (this.trails > 0) {
      for (const cell of this.trail) {
        this.clearCell(cell);
      }
    } else {
      this.clearCell(this.history.at(-1)!);
    }
  }
}

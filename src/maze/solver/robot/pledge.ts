import { type CellFacing, type Facing } from '../../geometry/index.ts';

import { Robot, type RobotProperties } from './robot.ts';

type Turn = 'right' | 'left';

export type PledgeRobotProperties = RobotProperties & {
  turn: Turn;
};

function rotateRight(cell: CellFacing): CellFacing {
  return {
    ...cell,
    facing: ({ N: 'E', E: 'S', S: 'W', W: 'N' } as Record<Facing, Facing>)[cell.facing],
  };
}

function rotateLeft(cell: CellFacing): CellFacing {
  return {
    ...cell,
    facing: ({ N: 'W', E: 'N', S: 'E', W: 'S' } as Record<Facing, Facing>)[cell.facing],
  };
}

export class PledgeRobot extends Robot {
  protected mode: 'straight' | 'wall' = 'straight';
  public counter: number;
  public readonly algorithm = 'pledge';
  public trueFacing: Facing;

  public constructor({ turn = 'right', ...props }: PledgeRobotProperties) {
    const program = turn === 'right' ? 'right-turn' : 'left-turn';
    super({ program, ...props });

    this.counter = 0;

    const moves = this.maze.moves(this.location, { wall: false });

    while (true) {
      const [straight] = this.maze.straight(this.location, this.bias);
      if (moves.some((m) => m.direction === straight)) {
        break;
      }
      this.location.facing = rotateLeft(this.location).facing;
    }

    this.trueFacing = this.location.facing;
  }

  public execute(): void {
    while (true) {
      console.log(this.mode, this.counter, this.location.facing);

      const moves = this.maze.moves(this.location, { wall: false });

      if (this.mode === 'straight') {
        const [straight] = this.maze.straight(this.location, this.bias);
        const move = moves.find((m) => m.direction === straight);
        if (move) {
          this.bias = !this.bias;
          this.moveTo(move.target);
          return;
        }

        this.location.facing = rotateRight(this.location).facing;
        this.counter -= 90;
        this.mode = 'wall';
      }

      const [left] = this.maze.leftTurn(this.location);
      const move = moves.find((m) => m.direction === left);
      if (move) {
        this.moveTo(move.target);
        this.counter += 90;
        if (this.counter === 0 && this.location.facing === this.trueFacing) {
          this.mode = 'straight';
        }
        return;
      }

      this.location.facing = rotateRight(this.location).facing;
      this.counter -= 90;
    }
  }
}

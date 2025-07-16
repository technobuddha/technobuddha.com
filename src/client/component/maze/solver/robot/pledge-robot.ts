import { type CellFacing, type Facing, type Move } from '../../geometry/index.ts';

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
    this.bias = !this.bias;

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
    // const v = ++this.visits[this.location.x][this.location.y];
    // if (v > Object.keys(this.maze.nexus(this.location).walls).length) {
    // throw new RobotError(`${this.name} is stuck in a loop.`, this.color);
    // }

    const moves = this.maze.moves(this.location, { wall: false });

    // console.log(
    //   'Execute',
    //   'counter=',
    //   this.counter,
    //   'mode=',
    //   this.mode,
    //   'facing',
    //   this.location.facing,
    //   'true',
    //   this.trueFacing,
    // );

    if (this.mode === 'straight') {
      // console.log('attempting to go straight');
      this.bias = !this.bias;
      const [straight] = this.maze.straight(this.location, this.bias);
      const move = moves.find((m) => m.direction === straight);
      if (move) {
        // console.log('Going straight');
        this.moveTo(move.target);
        this.counter = 0;
        return;
      }

      // console.log('no straight move found', this.location.facing);
      this.location.facing = rotateRight(this.location).facing;
      // console.log('Turning to face', this.location.facing);
      this.counter -= 90;
      // this.trueFacing = this.location.facing;
      this.mode = 'wall';
    }

    // console.log('walking the wall');
    const heading = this.maze.heading(this.location.facing);

    const [move] = this.maze
      .rightTurn(this.location)
      .map((direction) => moves.find((m) => m.direction === direction))
      .filter(Boolean) as Move[];
    const angle = this.maze.angle(move.direction);

    let diff = angle - heading;
    while (diff > 360) {
      diff -= 360;
    }
    while (diff < 0) {
      diff += 360;
    }
    if (diff > 180) {
      diff -= 360;
    }

    if (diff === 180) {
      console.log('180 degree turn');
      this.counter -= 180;
    } else {
      this.counter += diff;
      console.log(`Turning ${diff} degrees from ${heading} to ${angle}(${move.direction})`);
    }
    console.log('Counter:', this.counter);

    if (this.counter === 0 && this.location.facing === this.trueFacing) {
      console.log('Counter reset to 0, switching mode');
      this.mode = 'straight';
    }

    this.moveTo(move.target);
  }
}

import { CartesianSet, create2DArray } from '@technobuddha/library';

import { type Cell, type CellFacing, type CellTunnel } from '../geometry/index.ts';

import { type Robot } from './robot/index.ts';
import { Roboto, type RobotoProperties } from './roboto.ts';

export type ChainProperties = Omit<RobotoProperties, 'robots'> & {
  turn?: 'right' | 'left';
  robot?: 'wall-walking' | 'backtracking' | 'tremaux';
  avatarColor?: string;
  pathColor?: string;
  chainColor?: string;
};

export class Chain extends Roboto {
  private readonly avatarColor: NonNullable<ChainProperties['avatarColor']>;
  private readonly pathColor: NonNullable<ChainProperties['avatarColor']>;
  private readonly chainColor: NonNullable<ChainProperties['avatarColor']>;

  private current: CellFacing = this.maze.entrance;
  private chain: CellFacing[] = [];
  private history: CellFacing[] = [];
  private path: CellTunnel[] = [];
  private readonly blocked: boolean[][];
  private readonly makeRobot: (turn: 'right' | 'left', color: string) => Robot;

  public constructor({
    maze,
    robot = 'wall-walking',
    avatarColor = maze.color.avatar,
    pathColor = maze.color.path,
    chainColor = '#333333',
    ...props
  }: ChainProperties) {
    super({ maze, robots: [], ...props });

    this.avatarColor = avatarColor;
    this.pathColor = pathColor;
    this.chainColor = chainColor;

    this.blocked = create2DArray(maze.width, maze.height, false);

    this.makeRobot =
      robot === 'wall-walking' ?
        (turn: 'right' | 'left', color: string) =>
          this.createRobot(
            {
              algorithm: 'wall-walking',
              turn,
              program: turn === 'right' ? 'right-turn' : 'left-turn',
              color,
              clearCell: this.restoreCell.bind(this),
            },
            this.current,
          )
      : robot === 'backtracking' ?
        (turn: 'right' | 'left', color: string) =>
          this.createRobot(
            {
              algorithm: 'backtracking',
              program: turn === 'right' ? 'right-turn' : 'left-turn',
              color,
              clearCell: this.restoreCell.bind(this),
              blocked: this.blocked,
            },
            this.current,
          )
      : (turn: 'right' | 'left', color: string) =>
          this.createRobot(
            {
              algorithm: 'tremaux',
              program: turn === 'right' ? 'right-turn' : 'left-turn',
              color,
              clearCell: this.restoreCell.bind(this),
            },
            this.current,
          );
  }

  private restoreCell(cell: Cell): void {
    this.maze.drawCell(cell);

    const pathCell = this.path.find((c) => this.maze.isSame(c, cell));

    if (this.maze.isSame(cell, this.current)) {
      this.maze.drawAvatar(cell, this.avatarColor);
    } else if (pathCell) {
      this.maze.drawPath(this.maze.drawCell(pathCell), this.pathColor);
    } else if (this.chain.some((c) => this.maze.isSame(c, cell))) {
      this.maze.drawAvatar(cell, this.chainColor);
    } else if (this.blocked[cell.x][cell.y]) {
      this.maze.drawX(cell);
    }
  }

  private moveTo(cell: CellFacing): void {
    const location = this.current;

    this.current = cell;

    this.restoreCell(location);
    this.restoreCell(cell);
  }

  public override async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    let link: CellFacing = entrance;
    this.chain = [link];
    while (!this.maze.isSame(link, exit)) {
      this.maze.drawAvatar(this.maze.drawCell(link), this.chainColor);
      const [{ target }] = this.maze
        .moves(link, { wall: 'all' })
        .filter(({ target }) => !this.chain.some((c) => this.maze.isSame(c, target)))
        .sort(
          ({ target: a }, { target: b }) =>
            Math.hypot(a.x - exit.x, a.y - exit.y) - Math.hypot(b.x - exit.x, b.y - exit.y),
        );
      link = target;
      this.chain.push(link);
    }

    let pos = 0;

    this.current = {
      ...entrance,
      facing: this.maze.opposite(
        this.randomPick(this.maze.moves(entrance).map((m) => m.direction))!,
      ),
    };

    while (!this.maze.isSame(this.current, exit)) {
      const nextLinkOfChain = this.chain[pos + 1];

      // We are attempting to follow the chain...
      const moves = this.maze
        .moves(this.current, { wall: false })
        .filter(({ target }) => this.maze.isSame(target, nextLinkOfChain));
      if (moves.length > 0) {
        const original = this.current;

        const [next] = moves;
        this.history.push(next.target);
        this.path = this.maze.makePath(this.history);
        this.moveTo(next.target);
        this.restoreCell(this.current);
        this.restoreCell(original);
        pos++;
        yield;
      } else {
        this.activateOneRobot(this.makeRobot('right', 'lime'));
        this.activateOneRobot(this.makeRobot('left', 'magenta'));

        let searching = true;
        while (searching) {
          this.runAllRobots();
          yield;

          if (this.robots.length === 0) {
            this.maze.sendMessage('no solution found');
            return;
          }

          for (const robot of this.robots) {
            const chainPos = this.chain.findIndex((c) => this.maze.isSame(c, robot.location));

            if (chainPos > pos) {
              const redraw = new CartesianSet(this.path);

              this.history = this.maze.flatten([...this.history, ...robot.path()]);
              this.path = this.maze.makePath(this.history);

              redraw.add(this.path);

              for (const cell of redraw) {
                this.restoreCell(cell);
              }

              this.moveTo(this.chain[chainPos]);
              pos = chainPos;
              yield;

              searching = false;
            }
          }
        }

        this.killAllRobots();
      }
    }
    this.history.push(exit);

    this.maze.solution = this.maze.makePath(this.history);
  }
}

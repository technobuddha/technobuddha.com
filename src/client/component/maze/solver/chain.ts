import { CartesianSet, create2DArray } from '@technobuddha/library';

import { type Cell, type CellFacing, type CellTunnel } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';
import { BacktrackingRobot, type Robot, WallWalkingRobot } from './robot/index.ts';

export type ChainProperties = MazeSolverProperties & {
  turn?: 'right' | 'left';
  robot?: 'wall-walking' | 'backtracking';
  avatarColor?: string;
  pathColor?: string;
  chainColor?: string;
};

export class Chain extends MazeSolver {
  private readonly avatarColor: NonNullable<ChainProperties['avatarColor']>;
  private readonly pathColor: NonNullable<ChainProperties['avatarColor']>;
  private readonly chainColor: NonNullable<ChainProperties['avatarColor']>;

  private current: CellFacing = this.maze.entrance;
  private chain: CellFacing[] = [];
  private history: CellFacing[] = [];
  private path: CellTunnel[] = [];
  private readonly blocked: boolean[][];
  private readonly createRobot: (turn: 'right' | 'left', color: string) => Robot;

  public constructor({
    maze,
    robot = 'wall-walking',
    avatarColor = maze.avatarColor,
    pathColor = maze.pathColor,
    chainColor = '#333333',
    ...props
  }: ChainProperties) {
    super({ maze, ...props });

    this.avatarColor = avatarColor;
    this.pathColor = pathColor;
    this.chainColor = chainColor;

    this.blocked = create2DArray(maze.width, maze.height, false);

    this.createRobot =
      robot === 'wall-walking' ?
        (turn: 'right' | 'left', color: string) =>
          new WallWalkingRobot({
            maze: this.maze,
            location: this.current,
            clearCell: this.restoreCell.bind(this),
            trails: 5,
            turn,
            color,
          })
      : (turn: 'right' | 'left', color: string) =>
          new BacktrackingRobot({
            maze: this.maze,
            location: this.current,
            blocked: this.blocked,
            clearCell: this.restoreCell.bind(this),
            program: turn === 'right' ? 'right-turn' : 'left-turn',
            color,
          });
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
    }
  }

  private moveTo(cell: CellFacing): void {
    const location = this.current;

    this.current = cell;

    this.restoreCell(location);
    this.restoreCell(cell);
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    let link: CellFacing = entrance;
    this.chain = [link];
    while (!this.maze.isSame(link, exit)) {
      this.maze.drawAvatar(this.maze.drawCell(link), this.chainColor);
      const [{ move }] = this.maze
        .moves(link, { wall: 'all' })
        .filter(({ move }) => !this.chain.some((c) => this.maze.isSame(c, move)))
        .sort(
          ({ move: a }, { move: b }) =>
            Math.hypot(a.x - exit.x, a.y - exit.y) - Math.hypot(b.x - exit.x, b.y - exit.y),
        );
      link = move;
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
        .filter(({ move }) => this.maze.isSame(move, nextLinkOfChain));
      if (moves.length > 0) {
        const original = this.current;

        const [next] = moves;
        this.history.push(next.move);
        this.path = this.maze.makePath(this.history);
        this.moveTo(next.move);
        this.restoreCell(this.current);
        this.restoreCell(original);
        pos++;
        yield;
      } else {
        using robotR = this.createRobot('right', 'lime');
        using robotL = this.createRobot('left', 'magenta');

        let searching = true;
        while (searching) {
          for (const robot of [robotR, robotL]) {
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
              break;
            }

            robot.execute();
            yield;
          }
        }
      }
    }
    this.history.push(exit);

    this.maze.solution = this.maze.makePath(this.history);
  }
}

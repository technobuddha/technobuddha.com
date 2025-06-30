import { manhattanDistance } from '@technobuddha/library';

import { type Cell, type CellFacing, type Maze, type Move } from '../../geometry/index.ts';
import { darken } from '../../library/darken.ts';
import { Random, type RandomProperties } from '../../random/random.ts';

import { RobotError } from './robot-error.ts';

export type Program = 'random' | 'seek' | 'left-turn' | 'right-turn' | 'straight';

export type RobotProperties = RandomProperties & {
  maze: Maze;
  color?: string;
  location: CellFacing;
  program?: Program;
  trails?: number;
  showPath?: boolean;
  clearCell?: (cell: Cell) => void;
  name?: string;
};

export abstract class Robot extends Random implements Disposable {
  public active: boolean;
  public readonly color: string;
  public location: CellFacing;
  public readonly program: Program;
  public readonly name: string;

  protected previous: CellFacing;
  protected readonly history: CellFacing[];
  protected readonly trails: number;
  protected readonly trail: CellFacing[] = [];
  protected readonly showPath: boolean;
  protected readonly start: CellFacing;
  protected readonly maze: Maze;
  protected readonly clearCell: (cell: Cell) => void;
  protected bias = true;

  public constructor({
    maze,
    location = maze.entrance,
    color = maze.avatarColor,
    trails = 0,
    showPath = false,
    program = 'random',
    random = maze.random,
    clearCell = (cell) => maze.drawCell(cell),
    name = `Robot#${random()}`,
    ...props
  }: RobotProperties) {
    super({ random, ...props });
    this.active = true;

    this.maze = maze;

    this.program = program;
    this.name = name;

    this.color = color;
    this.trails = trails;
    this.showPath = showPath;
    this.clearCell = clearCell;

    this.location = location;
    this.previous = location;
    this.start = location;
    this.history = [location];
  }

  protected moveTo(next: CellFacing): void {
    if (this.showPath) {
      for (const cell of this.maze.makePath(this.path())) {
        this.clearCell(cell);
      }

      this.history.push(this.location);
      this.previous = this.location;
      this.location = next;

      for (const cell of this.maze.makePath(this.path())) {
        this.maze.drawPath(cell);
      }
    } else {
      this.history.push(this.location);
      this.previous = this.location;
      this.location = next;
    }

    this.clearCell(this.location);
    this.maze.drawAvatar(this.location, this.color);

    if (this.trails > 0) {
      while (this.trail.length > this.trails) {
        const cell = this.trail.pop()!;
        this.clearCell(cell);
      }

      for (let i = 0; i < this.trail.length; i++) {
        const cell = this.trail[i];
        this.clearCell(cell);
        this.maze.drawAvatar(cell, darken(this.color, (0.5 / this.trail.length) * (i + 1)));
      }

      this.trail.unshift(this.location);
    }
  }

  protected decide(moves: Move[]): Move | undefined {
    if (moves.length === 0) {
      return undefined;
    }

    switch (this.program) {
      case 'random': {
        return this.randomPick(moves);
      }

      case 'seek': {
        return moves.sort(
          (a, b) =>
            manhattanDistance({ x: a.target.x, y: a.target.y }, this.maze.exit) -
            manhattanDistance({ x: b.target.x, y: b.target.y }, this.maze.exit),
        )[0];
      }

      case 'left-turn': {
        for (const direction of this.maze.leftTurn(this.location)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      case 'right-turn': {
        for (const direction of this.maze.rightTurn(this.location)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      case 'straight': {
        this.bias = !this.bias;
        for (const direction of this.maze.straight(this.location, this.bias)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      default: {
        return moves[0];
      }
    }
  }

  public execute(): void {
    if (this.active) {
      try {
        this.step();
      } catch (error) {
        if (error instanceof RobotError) {
          this.sendMessage(error.message, error.color);
        } else {
          this.sendMessage(`Robot ${this.name} encountered an error: ${error}`);
        }
        this.active = false;
      }
    }
  }

  public abstract step(): void;

  public override sendMessage(message: string, color?: string): void {
    this.maze.sendMessage(message, color);
  }

  public path(): CellFacing[] {
    return this.maze.flatten([...this.history, this.location]);
  }

  //#region Disposable
  public dispose(): void {
    //
  }

  public [Symbol.dispose](): void {
    this.dispose();
  }
  //#endregion
}

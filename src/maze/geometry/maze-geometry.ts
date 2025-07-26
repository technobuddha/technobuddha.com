import {
  create2DArray,
  manhattanDistance,
  modulo,
  type Rect,
  toSquare,
} from '@technobuddha/library';

import { type MazeGenerator } from '#maze/generator';
import { Random, type RandomProperties } from '#maze/random';

import {
  type Cell,
  type CellFacing,
  type CellTunnel,
  type Direction,
  type Facing,
  type Move,
  type MoveOffset,
} from './geometry.ts';
import { type BridgeMatrix, type Matrix } from './matrix.ts';
import { Nexus, type Tunnels, type Via, type Wall } from './nexus.ts';

export function isFacing(orientation: string): orientation is Facing {
  return /^[A-Z!]$/u.test(orientation);
}

export function toFacing(direction: Direction): Facing {
  return direction === '?' ? '!' : (direction.toUpperCase() as Facing);
}

export function isDirection(orientation: string): orientation is Direction {
  return /^[a-z?]$/u.test(orientation);
}

export function toDirection(facing: Facing): Direction {
  return facing === '!' ? '?' : (facing.toLowerCase() as Direction);
}

export type AllOrder =
  | 'top-left'
  | 'left-top'
  | 'top-right'
  | 'right-top'
  | 'bottom-left'
  | 'left-bottom'
  | 'bottom-right'
  | 'right-bottom'
  | 'random';

export type MazeGeometryProperties = RandomProperties & {
  readonly width?: number;
  readonly height?: number;
  readonly wrapHorizontal?: boolean;
  readonly wrapVertical?: boolean;
};

export abstract class MazeGeometry extends Random {
  public width: NonNullable<MazeGeometryProperties['width']> = 25;
  public height: NonNullable<MazeGeometryProperties['height']> = 25;
  protected readonly requestedWidth: MazeGeometryProperties['width'];
  protected readonly requestedHeight: MazeGeometryProperties['height'];
  public readonly wrapHorizontal: NonNullable<MazeGeometryProperties['wrapHorizontal']>;
  public readonly wrapVertical: NonNullable<MazeGeometryProperties['wrapHorizontal']>;

  //#region Matrix
  public readonly directions: Matrix['directions'];
  public readonly pillars: Matrix['pillars'];
  protected readonly wallMatrix: Matrix['wall'];
  protected readonly oppositeMatrix: Matrix['opposite'];
  protected readonly rightTurnMatrix: Matrix['rightTurn'];
  protected readonly leftTurnMatrix: Matrix['leftTurn'];
  protected readonly straightMatrix: Matrix['straight'];
  protected readonly moveMatrix: Matrix['move'];
  protected readonly preferredMatrix: Matrix['preferred'];
  protected readonly angleMatrix: Matrix['angle'];
  protected readonly bridgeMatrix: BridgeMatrix | undefined;
  public readonly bridgePieces: number;
  //#endregion

  protected nexuses: Nexus[][] = [];

  //#region Hooks
  public hookPreGeneration: ((generator: MazeGenerator) => void) | undefined = undefined;
  public hookPostGeneration: ((generator: MazeGenerator) => void) | undefined = undefined;
  //#endregion

  public constructor(
    {
      width: requestedWidth,
      height: requestedHeight,
      wrapHorizontal = false,
      wrapVertical = false,
      ...props
    }: MazeGeometryProperties,
    matrix: Matrix,
  ) {
    super(props);

    this.requestedWidth = requestedWidth;
    this.requestedHeight = requestedHeight;

    this.wrapHorizontal = wrapHorizontal;
    this.wrapVertical = wrapVertical;

    this.directions = matrix.directions;
    this.pillars = matrix.pillars;
    this.wallMatrix = matrix.wall;
    this.oppositeMatrix = matrix.opposite;
    this.rightTurnMatrix = matrix.rightTurn;
    this.leftTurnMatrix = matrix.leftTurn;
    this.straightMatrix = matrix.straight;
    this.moveMatrix = matrix.move;
    this.preferredMatrix = matrix.preferred;
    this.angleMatrix = matrix.angle;
    this.bridgeMatrix = matrix.bridge;
    this.bridgePieces = matrix.bridge?.pieces ?? 1;
  }
  //#region Create Nexus
  public nexus(cell: Cell): Nexus {
    if (cell.x >= 0 && cell.y >= 0 && cell.x < this.width && cell.y < this.height) {
      return this.nexuses[cell.x][cell.y];
    }

    throw new Error(`No nexus for cell (${cell.x}, ${cell.y})`);
  }

  public createNexus(): void {
    this.nexuses = create2DArray(
      this.width,
      this.height,
      (x, y) =>
        new Nexus({
          x,
          y,
          walls: this.initialWalls({ x, y }),
          tunnels: this.initialTunnels({ x, y }),
          via: this.initialVia({ x, y }),
          barriers: this.initialBarriers({ x, y }),
          rect: toSquare(this.getRect({ x, y })),
        }),
    );
  }

  public initialWalls(cell: Cell): Wall {
    const kind = this.cellKind(cell);

    const initialWalls = this.wallMatrix[kind];

    if (initialWalls) {
      return { ...initialWalls };
    }

    throw new Error(`No initial walls for cell (${cell.x}, ${cell.y}) kind ${kind}`);
  }

  public initialTunnels(cell: Cell): Tunnels {
    return Object.fromEntries(
      Object.keys(this.initialWalls(cell)).map((d) => [d as Direction, false]),
    ) as Record<Direction, false>;
  }

  public initialVia(cell: Cell): Via {
    return Object.fromEntries(
      Object.keys(this.initialWalls(cell)).map((d) => [d as Direction, false]),
    ) as Record<Direction, false>;
  }

  public initialBarriers(cell: Cell): Wall {
    return Object.fromEntries(
      Object.keys(this.initialWalls(cell)).map((d) => [d as Direction, false]),
    ) as Record<Direction, false>;
  }

  public backup(): Nexus[][] {
    return structuredClone(this.nexuses);
  }

  public restore(backup: Nexus[][]): void {
    this.nexuses = structuredClone(backup);
  }

  protected abstract cellKind(cell: Cell): number;
  protected abstract getRect(cell: Cell): Rect;
  //#endregion Create Cells
  //#region Direction
  public angle(direction: Direction): number {
    const angle = this.angleMatrix[direction];
    if (angle != null) {
      return angle;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public heading(facing: Facing): number {
    return this.angle(toDirection(facing));
  }

  public opposite(facing: Facing): Direction;
  public opposite(direction: Direction): Facing;
  public opposite(orientation: Facing | Direction): Direction | Facing {
    if (isFacing(orientation)) {
      if (orientation === '!') {
        return '?';
      }

      const opposite = this.oppositeMatrix.facing[orientation];
      if (opposite) {
        return opposite;
      }

      throw new Error(`"${orientation}" is not a valid facing`);
    }

    if (orientation === '?') {
      return '!';
    }

    const opposite = this.oppositeMatrix.direction[orientation];
    if (opposite) {
      return opposite;
    }

    throw new Error(`"${orientation}" is not a valid direction`);
  }

  public rightTurn(cell: CellFacing): Direction[] {
    const rightTurn = this.rightTurnMatrix[cell.facing];
    if (rightTurn) {
      return rightTurn.filter((d) => d in this.nexus(cell).walls);
    }

    throw new Error(`"${cell.facing}" is not a valid facing`);
  }

  public leftTurn(cell: CellFacing): Direction[] {
    const leftTurn = this.leftTurnMatrix[cell.facing];
    if (leftTurn) {
      return leftTurn.filter((d) => d in this.nexus(cell).walls);
    }

    throw new Error(`"${cell.facing}" is not a valid facing`);
  }

  public straight(cell: CellFacing, bias = this.randomChance(0.5)): Direction[] {
    const straight = this.straightMatrix[cell.facing];
    if (straight) {
      const validDirections = straight.flatMap((dir) => {
        const dirs = Array.from(dir).filter((d) => d in this.nexus(cell).walls) as Direction[];
        return bias ? dirs : dirs.reverse();
      });
      return validDirections;
    }

    throw new Error(`"${cell.facing}" is not a valid direction`);
  }

  public straightest(cell: CellFacing, bias = this.randomChance(0.5)): Direction {
    const straights = this.straight(cell, bias);
    if (straights.length > 1) {
      return straights[0];
    }

    throw new Error(`(${cell.x},${cell.y}):${cell.facing} has no straight.`);
  }

  public forward(cell: CellFacing, bias = this.randomChance(0.5)): Direction {
    const [forward] = this.straight(cell, bias);
    return forward;
  }
  //#endregion Direction
  //#region Cell Selection
  public allCells(order: AllOrder = 'top-left'): Cell[] {
    const cells = create2DArray(this.width, this.height, (x, y) => ({ x, y })).flat();

    switch (order) {
      case 'top-left': {
        return cells.sort((a, b) => a.y - b.y || a.x - b.x);
      }
      case 'left-top': {
        return cells.sort((a, b) => a.x - b.x || a.y - b.y);
      }
      case 'top-right': {
        return cells.sort((a, b) => a.y - b.y || b.x - a.x);
      }
      case 'right-top': {
        return cells.sort((a, b) => b.x - a.x || a.y - b.y);
      }
      case 'bottom-left': {
        return cells.sort((a, b) => b.y - a.y || a.x - b.x);
      }
      case 'left-bottom': {
        return cells.sort((a, b) => a.x - b.x || b.y - a.y);
      }
      case 'bottom-right': {
        return cells.sort((a, b) => b.y - a.y || b.x - a.x);
      }
      case 'right-bottom': {
        return cells.sort((a, b) => b.x - a.x || b.y - a.y);
      }
      case 'random':
      default: {
        return this.randomShuffle(cells);
      }
    }
  }

  public cellsInMaze(order: AllOrder = 'top-left'): Cell[] {
    return this.allCells(order).filter((cell) => this.inMaze(cell));
  }

  public cellsUnderMask(order: AllOrder = 'top-left'): Cell[] {
    return this.cellsInMaze(order).filter((cell) => this.nexus(cell).mask);
  }

  public cellsOnEdge(order: AllOrder = 'top-left'): Cell[] {
    return this.cellsInMaze(order).filter(
      (cell) => this.moves(cell, { wall: 'all', inMaze: false }).length > 0,
    );
  }

  public cellsInterior(order: AllOrder = 'top-left'): Cell[] {
    return this.cellsInMaze(order).filter((cell) =>
      this.moves(cell, { wall: 'all', inMaze: 'all' }).every(({ target }) => this.inMaze(target)),
    );
  }

  public deadEnds(): Cell[] {
    return this.cellsInMaze().filter((cell) => this.isDeadEnd(cell));
  }

  public randomCell(): Cell {
    return this.randomPick(this.cellsInMaze())!;
  }

  public randomCellFacing(cell = this.randomCell()): CellFacing {
    const facing = this.opposite(this.randomPick(this.nexus(cell).wallDirections())!);
    return { ...cell, facing };
  }
  //#endregion
  //#region Cell
  public inMaze(cell: Cell): boolean {
    return (
      cell.x >= 0 &&
      cell.x < this.width &&
      cell.y >= 0 &&
      cell.y < this.height &&
      !this.nexus(cell).mask
    );
  }

  public isSame(cell1: Cell | undefined | null, cell2: Cell | undefined | null): boolean;
  public isSame(cell1: CellTunnel, cell2: CellTunnel): boolean {
    if (cell1 && cell2 && 'tunnel' in cell1 && 'tunnel' in cell2) {
      return cell1.x === cell2.x && cell1.y === cell2.y && cell1.tunnel === cell2.tunnel;
    }
    return cell1?.x === cell2?.x && cell1?.y === cell2?.y;
  }

  public isIdentical(cell1: CellFacing, cell2: CellFacing): boolean {
    return cell1.x === cell2.x && cell1.y === cell2.y && cell1.facing === cell2.facing;
  }

  public manhattanDistance(a: Cell, b: Cell): number {
    const distances: number[] = [manhattanDistance(a, b)];

    if (this.wrapHorizontal) {
      distances.push(
        manhattanDistance({ ...a, x: a.x + this.width }, b),
        manhattanDistance({ ...a, x: a.x - this.width }, b),
      );
    }
    if (this.wrapVertical) {
      distances.push(
        manhattanDistance({ ...a, y: a.y + this.height }, b),
        manhattanDistance({ ...a, y: a.y - this.height }, b),
      );
    }
    if (this.wrapHorizontal && this.wrapVertical) {
      distances.push(
        manhattanDistance({ x: a.x + this.width, y: a.y + this.height }, b),
        manhattanDistance({ x: a.x - this.width, y: a.y - this.height }, b),
      );
    }

    return Math.min(...distances);
  }

  public abstract isDeadEnd(cell: Cell): boolean;
  //#endregion
  //#region Movement
  public traverse(cell: Cell, direction: Direction): CellFacing {
    let move = this.moveMatrix[this.cellKind(cell)][direction];

    if (move) {
      if (Array.isArray(move)) {
        move = move[modulo(cell.y, move.length)];
      }

      return { ...this.resolveMove(cell, move), facing: toFacing(direction) };
    }

    throw new Error(`No traverse for cell (${cell.x}, ${cell.y}) in direction "${direction}"`);
  }

  public traversals(
    cell: Cell,
    { wall = 'all', inMaze = 'all' }: { wall?: boolean | 'all'; inMaze?: boolean | 'all' } = {},
  ): Move[] {
    return (Object.entries(this.nexus(cell).walls) as [Direction, boolean][])
      .filter(([, w]) => wall === 'all' || w === wall)
      .map(([direction]) => ({ direction, target: this.traverse(cell, direction) }))
      .filter(({ target }) => inMaze === 'all' || this.inMaze(target) === inMaze);
  }

  public traverseTo(source: Cell, destination: Cell): { direction: Direction; target: CellFacing } {
    return (
      this.nexus(source)
        .wallDirections()
        .map((direction) => ({
          direction,
          target: this.traverse(source, direction),
        }))
        .find(({ target }) => this.isSame(destination, target)) ?? {
        direction: '?',
        target: { ...destination, facing: '!' },
      }
    );
  }

  public move(cell: Cell, direction: Direction): CellFacing {
    return this.walk(cell, direction).target;
  }

  public moves(
    cell: Cell,
    { wall = false, inMaze = true }: { wall?: boolean | 'all'; inMaze?: boolean | 'all' } = {},
  ): Move[] {
    return (Object.entries(this.nexus(cell).walls) as [Direction, boolean][])
      .filter(([, w]) => wall === 'all' || w === wall)
      .map(([direction]) => ({ direction, ...this.walk(cell, direction) }))
      .filter(({ target }) => inMaze === 'all' || this.inMaze(target) === inMaze);
  }

  public walk(cell: Cell, direction: Direction): { target: CellFacing; tunnel?: CellFacing[] } {
    const tunnel: CellFacing[] = [];

    let target = this.traverse(cell, direction);
    while (this.inMaze(target)) {
      const { tunnels, via } = this.nexus(target);
      const facing = this.opposite(target.facing);

      const portal = tunnels[facing];
      if (portal) {
        tunnel.push(target);
        if (via[facing]) {
          tunnel.push(...via[facing]);
        }
        target = { ...portal };
      } else {
        break;
      }
    }

    return tunnel.length > 0 ? { target, tunnel } : { target };
  }

  public resolveMove(cell: Cell, move: MoveOffset): Cell {
    let { x, y } = cell;

    x += move.x;
    y += move.y;

    if (this.wrapHorizontal) {
      if (x < 0) {
        x += this.width;
      }
      if (x >= this.width) {
        x -= this.width;
      }
    }

    if (this.wrapVertical) {
      if (y < 0) {
        y += this.height;
      }
      if (y >= this.height) {
        y -= this.height;
      }
    }

    return { x, y };
  }

  public walkTo(
    source: Cell,
    destination: Cell,
  ): { direction: Direction; target: CellFacing; tunnel?: CellFacing[] } | undefined {
    return this.nexus(source)
      .wallDirections()
      .map((direction) => ({ direction, ...this.walk(source, direction) }))
      .find(({ target }) => this.isSame(destination, target));
  }

  public preferreds(cell: Cell): Direction[] {
    return this.moves(cell, { wall: true })
      .filter(({ direction }) => this.preferredMatrix[this.cellKind(cell)].includes(direction))
      .map(({ direction }) => direction);
  }
  //#endregion
}

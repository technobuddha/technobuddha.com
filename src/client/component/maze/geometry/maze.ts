import {
  create2DArray,
  modulo,
  rotate,
  scale,
  star,
  toRadians,
  translate,
} from '@technobuddha/library';

import { type Drawing, type Rect } from '../drawing/drawing.ts';
import { type MazeGenerator } from '../generator/index.ts';
import { darken } from '../library/darken.ts';
import { logger } from '../library/logger.ts';
import { Random, type RandomProperties } from '../random/random.ts';

import { Nexus } from './nexus.ts';

const starShape = rotate(star(5, 0.5, 1), Math.PI / 10);

// prettier-ignore
export type Direction =
  |'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'|'?';

// prettier-ignore
export type Facing =
  |'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z'|'!';

export type Pillar = `${Direction}${Direction}`;

export type Kind = number;

export type XY = { x: number; y: number };

export type MoveOffset = { x: number; y: number; zone?: 'up' | 'down' };

export type Cell = {
  x: number;
  y: number;
};

export type CellDirection = Cell & {
  direction: Direction;
};

export type CellFacing = Cell & {
  facing: Facing;
};

export type CellTunnel = CellDirection & {
  tunnel: boolean;
};

export type Move = {
  direction: Direction;
  move: CellFacing;
};

export type Terminus = CellFacing;

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

type Zone = 'edge' | 'interior';
type Location = `${AllOrder} ${Zone}`;

export type Directional<T> = Partial<Record<Direction, T | false | undefined>>;
export type Wall = Directional<true>;
export type Tunnels = Directional<CellFacing>;

export type CustomDrawingSize = {
  readonly width: number;
  readonly height: number;
  readonly actualWidth: number;
  readonly actualHeight: number;
};

export type DrawingSizes = {
  readonly groupWidth: number;
  readonly groupHeight: number;
  readonly verticalCellsPerGroup?: number;
  readonly horizontalCellsPerGroup?: number;
  readonly topPadding?: number;
  readonly leftPadding?: number;
  readonly bottomPadding?: number;
  readonly rightPadding?: number;
  readonly custom?: (this: void, args: CustomDrawingSize) => CustomDrawingSize;
};

type ShowDistances = 'none' | 'greyscale' | 'primary' | 'color' | 'spectrum';

type Loop = {
  readonly cell: Cell;
  readonly distance: number;
  readonly loops: Cell[];
  readonly distances: number[];
};

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

export type MazeProperties = RandomProperties & {
  readonly drawing?: Drawing;
  readonly width?: number;
  readonly height?: number;
  readonly cellSize?: number;
  readonly wallSize?: number;
  readonly gapSize?: number;
  readonly entrance?: Cell | CellDirection | Location;
  readonly exit?: Cell | CellDirection | Location;
  readonly wrapHorizontal?: boolean;
  readonly wrapVertical?: boolean;

  readonly backgroundColor?: string;
  readonly cellColor?: string;
  readonly wallColor?: string;
  readonly maskColor?: string;
  readonly entranceColor?: string;
  readonly exitColor?: string;
  readonly tunnelColor?: string;
  readonly solutionColor?: string;
  readonly solutionTunnelColor?: string;
  readonly scannedColor?: string;
  readonly avatarColor?: string;
  readonly prunedColor?: string;
  readonly pathColor?: string;
  readonly blockedColor?: string;
  readonly errorColor?: string;
  readonly bridgeColor?: string;
  readonly textColor?: string;

  readonly showDistances?: ShowDistances;
  readonly showCoordinates?: boolean;
  readonly showKind?: boolean;

  readonly braidFactor?: number;

  readonly plugin?: (this: void, maze: Maze) => void;
};

export type BridgeLayout = {
  readonly pieces: number;
  readonly direction: Direction;
  readonly path: Direction[];
  readonly connect: Partial<Record<Direction, Direction>>;
};

export type BridgeMatrix = {
  readonly pieces?: number;
  readonly connect?: Partial<Record<Direction, Direction>>;
  readonly layouts: Record<Kind, { path: Direction[]; pieces?: number }[]>;
};

export type Matrix = {
  readonly directions: Direction[];
  readonly pillars: Pillar[];
  readonly wall: Record<Kind, Partial<Record<Direction, boolean>>>;
  readonly opposite: {
    readonly direction: Partial<Record<Direction, Facing>>;
    readonly facing: Partial<Record<Facing, Direction>>;
  };
  readonly rightTurn: Partial<Record<Facing, Direction[]>>;
  readonly leftTurn: Partial<Record<Facing, Direction[]>>;
  readonly straight: Partial<Record<Facing, (Direction | `${Direction}${Direction}`)[]>>;
  readonly move: Record<Kind, Partial<Record<Direction, MoveOffset | MoveOffset[]>>>;
  readonly preferred: Record<Kind, Direction[]>;
  readonly angle: Partial<Record<Direction, number>>;
  readonly bridge?: BridgeMatrix;
};

export abstract class Maze extends Random {
  //#region Properties
  public readonly wrapHorizontal: boolean;
  public readonly wrapVertical: boolean;
  public entrance: Terminus = { x: -1, y: -1, facing: '!' };
  public exit: Terminus = { x: -1, y: -1, facing: '!' };
  public solution: CellTunnel[] = [];

  public leftOffset = 0;
  public topOffset = 0;
  public readonly bridgePieces: number;

  public width: NonNullable<MazeProperties['width']> = 25;
  public height: NonNullable<MazeProperties['height']> = 25;
  public readonly wallSize: NonNullable<MazeProperties['wallSize']>;
  public readonly cellSize: NonNullable<MazeProperties['cellSize']>;
  public readonly gapSize: NonNullable<MazeProperties['gapSize']>;
  public readonly showDistances: NonNullable<MazeProperties['showDistances']>;
  public readonly showCoordinates: NonNullable<MazeProperties['showCoordinates']>;
  public readonly showKind: NonNullable<MazeProperties['showKind']>;

  private readonly entranceSpec: MazeProperties['entrance'];
  private readonly exitSpec: MazeProperties['exit'];
  protected plugin: MazeProperties['plugin'];
  protected readonly requestedWidth: MazeProperties['width'];
  protected readonly requestedHeight: MazeProperties['height'];
  protected readonly braidFactor: NonNullable<MazeProperties['braidFactor']>;

  protected drawing: MazeProperties['drawing'];
  //#endregion
  //#region Colors
  public readonly backgroundColor: NonNullable<MazeProperties['backgroundColor']>;
  public readonly cellColor: NonNullable<MazeProperties['cellColor']>;
  public readonly wallColor: NonNullable<MazeProperties['wallColor']>;
  public readonly maskColor: NonNullable<MazeProperties['maskColor']>;
  public readonly entranceColor: NonNullable<MazeProperties['entranceColor']>;
  public readonly exitColor: NonNullable<MazeProperties['exitColor']>;
  public readonly tunnelColor: NonNullable<MazeProperties['tunnelColor']>;
  public readonly solutionColor: NonNullable<MazeProperties['solutionColor']>;
  public readonly solutionTunnelColor: NonNullable<MazeProperties['solutionTunnelColor']>;
  public readonly scannedColor: NonNullable<MazeProperties['scannedColor']>;
  public readonly avatarColor: NonNullable<MazeProperties['avatarColor']>;
  public readonly prunedColor: NonNullable<MazeProperties['prunedColor']>;
  public readonly pathColor: NonNullable<MazeProperties['pathColor']>;
  public readonly blockedColor: NonNullable<MazeProperties['blockedColor']>;
  public readonly errorColor: NonNullable<MazeProperties['errorColor']>;
  public readonly bridgeColor: NonNullable<MazeProperties['bridgeColor']>;
  public readonly textColor: NonNullable<MazeProperties['textColor']>;
  //#endregion
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
  //#endregion
  //#region Hooks
  public hookPreGeneration: ((generator: MazeGenerator) => void) | undefined = undefined;
  public hookPostGeneration: ((generator: MazeGenerator) => void) | undefined = undefined;
  //#endregion
  //#region Nexus
  protected nexuses: Nexus[][] = [];
  //#endregion
  //#region Construction
  public constructor(
    {
      drawing,
      width: requestedWidth,
      height: requestedHeight,
      cellSize = 21,
      wallSize = 1,
      gapSize = 0,
      entrance,
      exit,
      wrapHorizontal = false,
      wrapVertical = false,

      backgroundColor = 'oklch(0.20 0 0)',
      cellColor = 'oklch(0 0 0)',
      wallColor = 'oklch(0.6993 0 0)',
      maskColor = cellColor,
      entranceColor = 'oklch(0.5198 0.176858 142.4953)',
      exitColor = 'oklch(0.628 0.2577 29.23)',
      solutionColor = 'oklch(0.6611 0.115 213.72)',
      solutionTunnelColor = darken(solutionColor, 0.25),
      scannedColor = 'oklch(0.5789 0.2344 0.51)',
      avatarColor = 'oklch(0.6611 0.115 213.72)',
      prunedColor = 'oklch(0.4446 0.1803 359.81)',
      blockedColor = 'oklch(0.6298 0.2145 27.83)',
      errorColor = 'oklch(0.8664 0.294827 142.4953)',

      pathColor = 'oklch(0.8145 0.1672 83.88)',
      tunnelColor = darken(pathColor, 0.25),
      bridgeColor = 'oklch(0.9544 0.0637 196.13)',
      textColor = 'oklch(1 0 0)',

      showDistances = 'none',
      showCoordinates = false,
      showKind = false,
      braidFactor = 0,

      plugin,
      ...props
    }: MazeProperties,
    matrix: Matrix,
  ) {
    super(props);
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

    this.cellSize = cellSize;
    this.wallSize = wallSize;
    this.gapSize = gapSize;

    this.drawing = drawing;

    this.backgroundColor = backgroundColor;
    this.cellColor = cellColor;
    this.wallColor = wallColor;
    this.maskColor = maskColor;
    this.entranceColor = entranceColor;
    this.exitColor = exitColor;
    this.tunnelColor = tunnelColor;
    this.solutionColor = solutionColor;
    this.solutionTunnelColor = solutionTunnelColor;
    this.scannedColor = scannedColor;
    this.avatarColor = avatarColor;
    this.prunedColor = prunedColor;
    this.pathColor = pathColor;
    this.blockedColor = blockedColor;
    this.errorColor = errorColor;
    this.bridgeColor = bridgeColor;
    this.textColor = textColor;

    this.showDistances = showDistances;
    this.showCoordinates = showCoordinates;
    this.showKind = showKind;

    this.wrapHorizontal = wrapHorizontal;
    this.wrapVertical = wrapVertical;

    this.entranceSpec = entrance;
    this.exitSpec = exit;

    this.requestedWidth = requestedWidth;
    this.requestedHeight = requestedHeight;
    this.plugin = plugin;
    this.braidFactor = braidFactor;

    this.reset();
  }

  public reset(): void {
    let width = this.requestedWidth;
    let height = this.requestedHeight;
    let leftOffset: number | undefined = undefined;
    let topOffset: number | undefined = undefined;

    if (this.drawing) {
      const {
        groupWidth,
        groupHeight,
        verticalCellsPerGroup = 1,
        horizontalCellsPerGroup = 1,
        topPadding = 0,
        leftPadding = 0,
        rightPadding = 0,
        bottomPadding = 0,
        custom,
      } = this.drawingSize();

      width ??=
        Math.floor(
          (this.drawing.width - (leftPadding + rightPadding + this.wallSize * 2)) / groupWidth,
        ) * horizontalCellsPerGroup;
      height ??=
        Math.floor(
          (this.drawing.height - (topPadding + bottomPadding + this.wallSize * 2)) / groupHeight,
        ) * verticalCellsPerGroup;

      let actualWidth = (width / horizontalCellsPerGroup) * groupWidth + this.wallSize * 2;
      let actualHeight = (height / verticalCellsPerGroup) * groupHeight + this.wallSize * 2;

      if (custom) {
        ({ width, height, actualWidth, actualHeight } = custom({
          width,
          height,
          actualWidth,
          actualHeight,
        }));
      }

      const availableHeight = this.drawing.height - (topPadding + bottomPadding);
      const availableWidth = this.drawing.width - (leftPadding + rightPadding);

      leftOffset = leftPadding + (availableWidth - actualWidth) / 2;
      topOffset = topPadding + (availableHeight - actualHeight) / 2;
    }

    this.width = width ?? 25;
    this.height = height ?? 25;
    this.leftOffset = leftOffset ?? 0;
    this.topOffset = topOffset ?? 0;

    this.createCells();

    this.plugin?.(this);
  }

  public createCells(): void {
    this.nexuses = create2DArray(
      this.width,
      this.height,
      (x, y) =>
        new Nexus({
          x,
          y,
          walls: this.initialWalls({ x, y }),
          tunnels: this.initialTunnels({ x, y }),
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
  //#endregion
  //#region Direction
  public angle(direction: Direction): number {
    const angle = this.angleMatrix[direction];
    if (angle != null) {
      return angle;
    }

    throw new Error(`"${direction}" is not a valid direction`);
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
  //#endregion
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
      this.moves(cell, { wall: 'all', inMaze: 'all' }).every(({ move }) => this.inMaze(move)),
    );
  }

  public deadEnds(): Cell[] {
    return this.cellsInMaze().filter((cell) => this.isDeadEnd(cell));
  }

  public randomCell(): Cell {
    return this.randomPick(this.cellsInMaze())!;
  }

  public randomCellFacing(cell = this.randomCell()): CellFacing {
    const facing = this.opposite(this.randomPick(this.nexus(cell).wallDirections)!);
    return { ...cell, facing };
  }

  public removeInteriorWalls(): void {
    for (const cell of this.cellsInMaze()) {
      const wall = this.nexus(cell).walls;
      for (const direction of (Object.keys(wall) as Direction[]).filter((d) => wall[d])) {
        const move = this.move(cell, direction);
        if (move && this.inMaze(move)) {
          wall[direction] = false;
        }
      }
    }
  }
  //#endregion
  //#region Maze
  public backup(): Nexus[][] {
    return structuredClone(this.nexuses);
  }

  public restore(backup: Nexus[][]): void {
    this.nexuses = structuredClone(backup);
  }
  public analyze(entrance: Cell = this.entrance): {
    maxDistance: number;
    maxCell: Cell;
    distances: number[][];
    unreachable: Cell[];
    loops: Loop[];
  } {
    const distances = create2DArray(this.width, this.height, Infinity);
    const loops: Loop[] = [];
    const queue: Cell[] = [];
    queue.unshift(entrance);

    distances[entrance.x][entrance.y] = 0;

    let maxDistance = 1;
    let maxCell = entrance;
    while (queue.length > 0) {
      const cell = queue.pop()!;
      const distance = distances[cell.x][cell.y];

      if (distance > maxDistance) {
        maxDistance = distance;
        maxCell = cell;
      }

      const loopCells = this.moves(cell, { wall: false })
        .filter(({ move }) => distances[move.x][move.y] < distance - 1)
        .map(({ move }) => move);
      if (loopCells.length > 0) {
        loops.push({
          cell,
          loops: loopCells,
          distance,
          distances: loopCells.map((l) => distances[l.x][l.y]),
        });
      }

      const moves = this.moves(cell, { wall: false })
        .filter(({ move }) => distances[move.x][move.y] === Infinity)
        .map(({ move }) => move);
      for (const next of moves) {
        distances[next.x][next.y] = distance + 1;
        queue.unshift(next);
      }
    }

    const unreachable = this.cellsInMaze().filter((cell) => distances[cell.x][cell.y] === Infinity);

    return { maxDistance, maxCell, distances, unreachable, loops };
  }

  public async *braid(): AsyncGenerator<void> {
    const deadEnds = this.deadEnds();
    const target = deadEnds.length - Math.floor(this.braidFactor * deadEnds.length);

    while (deadEnds.length > target) {
      const index = this.randomNumber(deadEnds.length);
      const cell = deadEnds[index];

      deadEnds.splice(index, 1);

      const move = this.randomPick(this.moves(cell, { wall: true }));
      if (move) {
        this.removeWall(cell, move.direction);
        yield;
        const nindex = deadEnds.findIndex((c) => this.isSame(c, move.move));
        if (nindex >= 0) {
          deadEnds.splice(nindex, 1);
        }
      }
    }
  }

  public addTermini(): this {
    let entrance: Cell;
    let exit: Cell;

    if (this.entranceSpec && this.exitSpec) {
      entrance = this.parseSpecification(this.entranceSpec);
      exit = this.parseSpecification(this.exitSpec);
    } else if (this.entranceSpec) {
      entrance = this.parseSpecification(this.entranceSpec);
      exit = this.analyze(entrance).maxCell;
    } else if (this.exitSpec) {
      exit = this.parseSpecification(this.exitSpec);
      entrance = this.analyze(exit).maxCell;
    } else {
      entrance = this.analyze(this.randomCell()).maxCell;
      exit = this.analyze(entrance).maxCell;
    }

    const outsideEntrance = this.randomPick(this.moves(entrance, { wall: true, inMaze: false }));
    if (outsideEntrance) {
      this.entrance = { ...entrance, facing: this.opposite(outsideEntrance.direction) };
      this.nexus(this.entrance).walls[outsideEntrance.direction] = false;
    } else {
      const direction = this.randomPick(
        this.moves(entrance, { wall: false }).map(({ direction }) => direction),
      );
      const facing =
        direction ?
          this.opposite(
            this.randomPick(this.nexus(entrance).wallDirections.filter((d) => d !== direction))!,
          )
        : '!';
      this.entrance = { ...entrance, facing };
    }

    const outsideExit = this.randomPick(this.moves(exit, { wall: true, inMaze: false }));
    if (outsideExit) {
      this.exit = { ...exit, facing: this.opposite(outsideExit.direction) };
      this.nexus(this.exit).walls[outsideExit.direction] = false;
    } else {
      this.exit = { ...exit, facing: '!' };
    }

    return this;
  }
  //#endregion
  //#region Maze Drawing
  public attachDrawing(drawing?: Drawing): Drawing | undefined {
    const current = this.drawing;
    const replaced = current !== drawing;

    this.drawing = drawing;
    if (replaced) {
      this.clear();
    }
    return current;
  }

  protected abstract drawingSize(): DrawingSizes;

  public clear(color: string = this.backgroundColor): void {
    if (this.drawing) {
      this.drawing.clear(color, this.leftOffset, this.topOffset);
    }
  }

  public draw(): void {
    if (this.drawing) {
      this.clear();

      for (const cell of this.cellsInMaze()) {
        this.drawCell(cell);
      }

      this.drawMasks();
    }
  }

  public drawMasks(): void {
    if (this.drawing) {
      for (const cell of this.cellsUnderMask()) {
        this.drawFloor(cell, this.maskColor);
      }
    }
  }

  public detectErrors(): void {
    const { unreachable, loops } = this.analyze(this.entrance);

    if (unreachable.length > 0) {
      logger.error(`Unreachable cells: `, unreachable);
      for (const cell of unreachable) {
        this.drawCell(cell, this.errorColor);
      }
    }

    if (loops.length > 0) {
      for (const loop of loops) {
        logger.error(
          `Loop detected from {x: ${loop.cell.x}, y: ${loop.cell.y} :: ${loop.distance}} with ${loop.loops.map((l, i) => `{x: ${l.x}, y:${l.y} :: ${loop.distances[i]}}`).join(' ')}`,
        );

        this.drawX(loop.cell, this.errorColor);
      }
    }

    if (loops.length > 0 || unreachable.length > 0) {
      // eslint-disable-next-line no-debugger
      debugger;
    }
  }

  public drawDistances(point = this.entrance): void {
    if (this.drawing) {
      const { maxDistance, distances } = this.analyze(point);

      for (let x = 0; x < distances.length; ++x) {
        for (let y = 0; y < distances[x].length; ++y) {
          this.nexuses[x][y].distance = distances[x][y];
        }
      }

      for (const cell of this.cellsInMaze()) {
        if (this.isSame(this.entrance, cell) || this.isSame(this.exit, cell)) {
          this.drawCell(cell);
        } else {
          const { distance } = this.nexus(cell);
          let color: string | undefined = undefined;

          if (distance === Infinity) {
            color = this.errorColor;
          } else {
            const grey = (1 - distance / maxDistance) * 0.35 + 0.15;

            switch (this.showDistances) {
              case 'none': {
                color = this.cellColor;
                break;
              }

              case 'greyscale': {
                // color = `rgba(${255 * grey}, ${255 * grey}, ${255 * grey})`;
                color = `oklch(${grey} 0 0)`;
                break;
              }

              case 'primary': {
                // color = `hsl(212, 72.3%, ${3 + 35 * (1 - this.nexus(cell).distance / maxDistance)}%)`;
                color = `oklch(${grey} 0.115 213.72)`;
                //oklch(0.6611 0.115 213.72)
                break;
              }

              case 'color': {
                color = `hsl(276, 100%, ${15 + 35 * (1 - this.nexus(cell).distance / maxDistance)}%)`;
                break;
              }

              case 'spectrum': {
                //color = `hsl(${(this.nexus(cell).distance * 360) / maxDistance}, 25%, 50%)`;
                color = `oklch(0.5999 0.1279 ${(1 - distance / maxDistance) * 360} )`;
                break;
              }
              // no default
            }
          }

          if (color) {
            this.drawCell(cell, color);
          }
        }
      }

      //this.drawMasks();
    }
  }

  public drawSolution(color = this.solutionColor): void {
    if (this.drawing) {
      this.drawDistances();
      this.drawPaths(this.solution, color);
      this.drawCell(this.exit);
      this.drawPath({ ...this.exit, direction: this.opposite(this.exit.facing) }, color);
    }
  }
  //#endregion
  //#region Cell
  public nexus(cell: Cell): Nexus {
    if (cell.x >= 0 && cell.y >= 0 && cell.x < this.width && cell.y < this.height) {
      return this.nexuses[cell.x][cell.y];
    }

    throw new Error(`No nexus for cell (${cell.x}, ${cell.y})`);
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

  public isDeadEnd(cell: Cell): boolean {
    return (
      !this.isSame(cell, this.entrance) &&
      !this.isSame(cell, this.exit) &&
      this.moves(cell, { wall: false }).length === 1
    );
  }

  public inMaze(cell: Cell): boolean {
    return (
      cell.x >= 0 &&
      cell.x < this.width &&
      cell.y >= 0 &&
      cell.y < this.height &&
      !this.nexus(cell).mask
    );
  }
  //#endregion
  //#region Path
  public makePath(history: CellFacing[]): CellTunnel[] {
    const path: CellTunnel[] = [];

    if (history.length > 0) {
      let [prev, ...rest] = history;
      for (const cell of rest) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        const direction = this.nexus(prev).wallDirections.find((d) =>
          this.isSame(cell, this.move(prev, d)),
        );

        if (direction) {
          const { tunnel } = this.walk(prev, direction);
          if (tunnel) {
            for (const span of tunnel) {
              path.push({
                x: prev.x,
                y: prev.y,
                direction: toDirection(span.facing),
                tunnel: true,
              });
              prev = span;
            }
          }

          path.push({ x: prev.x, y: prev.y, direction: toDirection(cell.facing), tunnel: false });
          prev = cell;
        }
      }
    }
    return path;
  }

  public flatten<T extends Cell = Cell>(path: T[]): T[] {
    const flatPath: T[] = [];

    for (let i = 0; i < path.length; ++i) {
      const cell = path[i];

      const loop = path.findLastIndex((c) => this.isSame(c, cell));
      if (loop > i) {
        // If we find a loop, we skip the rest of the path
        i = loop;
        flatPath.push(path[loop]);
      } else {
        flatPath.push(cell);
      }
    }

    return flatPath;
  }
  //#endregion
  //#region Construction
  public addWall(cell: Cell, direction: Direction, draw = true): void {
    if (this.inMaze(cell)) {
      this.nexus(cell).addWall(direction);
      if (draw) {
        this.drawCell(cell);
      }

      const cell2 = this.move(cell, direction);
      if (this.inMaze(cell2)) {
        const direction2 = this.opposite(cell2.facing);

        this.nexus(cell2).addWall(direction2);
        if (draw) {
          this.drawCell(cell2);
        }
      }
    }
  }

  public removeWall(cell: Cell, direction: Direction): void {
    if (this.inMaze(cell)) {
      this.nexus(cell).removeWall(direction);
      this.drawCell(cell);

      const cell2 = this.move(cell, direction);
      if (this.inMaze(cell2)) {
        const direction2 = this.opposite(cell2.facing);

        this.nexus(cell2).removeWall(direction2);
        this.drawCell(cell2);
      }
    }
  }
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
      .map(([direction]) => ({ direction, move: this.traverse(cell, direction) }))
      .filter(({ move }) => inMaze === 'all' || this.inMaze(move) === inMaze);
  }

  public move(cell: Cell, direction: Direction): CellFacing {
    let next = this.traverse(cell, direction);

    if (next) {
      while (true) {
        const portal =
          this.inMaze(next) ? this.nexus(next).tunnels[this.opposite(next.facing)] : false;
        if (portal) {
          next = portal;
        } else {
          break;
        }
      }

      return next;
    }

    throw new Error(`No move for cell (${cell.x}, ${cell.y}) in direction "${direction}"`);
  }
  public moves(
    cell: Cell,
    { wall = false, inMaze = true }: { wall?: boolean | 'all'; inMaze?: boolean | 'all' } = {},
  ): Move[] {
    return (Object.entries(this.nexus(cell).walls) as [Direction, boolean][])
      .filter(([, w]) => wall === 'all' || w === wall)
      .map(([direction]) => ({ direction, move: this.move(cell, direction) }))
      .filter(({ move }) => inMaze === 'all' || this.inMaze(move) === inMaze);
  }

  public walk(
    cell: Cell,
    direction: Direction,
  ): { next: CellFacing; tunnel: CellFacing[] | undefined } {
    const tunnel: CellFacing[] = [];

    let next = this.traverse(cell, direction);
    while (true) {
      const portal =
        this.inMaze(next) ? this.nexus(next).tunnels[this.opposite(next.facing)] : false;
      if (portal) {
        tunnel.push(next);
        next = { ...portal };
      } else {
        break;
      }
    }

    return { next, tunnel: tunnel.length > 0 ? tunnel : undefined };
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

  public directionTo(source: Cell, destination: Cell): Direction | undefined {
    return (Object.keys(this.nexus(source).walls) as Direction[]).find((direction) =>
      this.isSame(destination, this.move(source, direction)),
    );
  }

  public preferreds(cell: Cell): Direction[] {
    return this.moves(cell, { wall: 'all' })
      .filter(({ direction }) => this.preferredMatrix[this.cellKind(cell)].includes(direction))
      .map(({ direction }) => direction);
  }
  //#endregion
  //#region Cell Kind
  public abstract cellKind(cell: Cell): Kind;
  public cellZone(_cell: Cell): number {
    return 0;
  }
  //#endregion
  //#region Cell Drawing
  public drawCell<T extends Cell>(
    cell: T,
    cellColor = this.cellColor,
    wallColor = this.wallColor,
  ): T {
    this.drawFloor(
      cell,
      this.isSame(cell, this.entrance) ? this.entranceColor
      : this.isSame(cell, this.exit) ? this.exitColor
        // this.nexus(cell).bridge ? this.bridgeColor
      : cellColor,
    );

    this.drawWalls(cell, wallColor);
    this.drawPillars(cell, wallColor);

    // if (this.nexus(cell).bridge) {
    // this.drawText(cell, '◯', 'white');
    // } else
    if (this.showCoordinates) {
      this.drawText(cell, cell.x === 0 ? cell.y.toString() : cell.x.toString());
    } else if (this.showKind) {
      this.drawText(cell, this.cellKind(cell).toString());
    }

    return cell;
  }

  public drawWalls(cell: Cell, color = this.wallColor): void {
    const nexus = this.nexus(cell);
    const { walls, tunnels } = nexus;

    for (const direction of Object.keys(walls) as Direction[]) {
      if (walls[direction]) {
        if (tunnels[direction]) {
          const move = this.traverse(cell, direction);
          if (this.inMaze(move) && !this.nexus(move).walls[this.opposite(move.facing)]) {
            this.drawBridge({ ...cell, direction }, this.bridgeColor); //color);
            continue;
          }
        }
        this.drawWall({ ...cell, direction }, color);
      } else {
        const move = this.traverse(cell, direction);
        if (move && this.inMaze(move) && this.nexus(move).tunnels[direction]) {
          this.drawTunnel({ ...cell, direction });
          continue;
        }
        this.drawDoor({ ...cell, direction }, color);
      }
    }
  }

  public drawPillars(cell: Cell, color = this.wallColor): void {
    const { walls } = this.nexus(cell);

    for (const pillar of this.pillars) {
      if (pillar[0] in walls && pillar[1] in walls) {
        this.drawPillar(cell, pillar, color);
      }
    }
  }

  public drawText(cell: Cell, text: string, color = this.textColor): void {
    if (this.drawing) {
      this.drawing.text(this.getRect(cell), text, color);
    }
  }

  public drawBridge(cell: CellDirection, color = this.bridgeColor): void {
    if (this.drawing) {
      this.drawWall(cell, color);
    }
  }

  public drawTunnel(_cell: CellDirection, _color = this.wallColor): void {
    // Most don't draw a tunnel
  }

  public drawDoor(_cell: CellDirection, _color: string = this.wallColor): void {
    // Most mazes don't have to draw a door, it just the lack of a wall.
  }

  public drawPath(cell: CellDirection, color = this.pathColor): void {
    if (this.drawing) {
      const rect = this.cellRect(cell);
      if (cell.direction === '?') {
        this.renderCircle(rect, color);
      } else {
        const angle = this.angleMatrix[cell.direction] ?? 0;

        this.renderArrow(rect, angle, color);
      }
    }
  }

  public drawPaths(cells: CellTunnel[], color = this.pathColor): void {
    if (this.drawing) {
      for (const cell of cells) {
        this.drawPath(cell, cell.tunnel ? darken(color, 0.5) : color);
      }
    }
  }

  public drawStar(cell: Cell, color = this.avatarColor): void {
    if (this.drawing) {
      const rect = this.cellRect(cell);
      this.renderStar(rect, color);
    }
  }

  protected renderArrow(rect: Rect, angle: number, color: string): void {
    this.renderShape(
      [
        { x: 1, y: 0 },
        { x: -1, y: 2 / 3 },
        { x: 0, y: 0 },
        { x: -1, y: -2 / 3 },
      ],
      rect,
      angle,
      color,
    );
  }

  protected renderStar(rect: Rect, color: string): void {
    this.renderShape(starShape, rect, 0, color);
  }

  protected renderShape(coords: XY[], rect: Rect, angle: number, color: string): void {
    if (this.drawing) {
      this.drawing.polygon(
        translate(
          rotate(scale(coords, { x: rect.width / 2, y: rect.height / 2 }), toRadians(angle)),
          {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          },
        ),
        color,
      );
    }
  }

  public drawAvatar(cell: Cell, color = this.avatarColor): void {
    if (this.drawing) {
      this.drawCell(cell);
      const rect = this.cellRect(cell);

      this.drawing.circle(
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        Math.abs(rect.width) / 4,
        color,
      );
    }
  }

  protected renderCircle(rect: Rect, color: string): void {
    if (this.drawing) {
      this.drawing.circle(
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        Math.abs(rect.width) / 4,
        color,
      );
    }
  }

  protected cellRect(cell: Cell): Rect {
    const rect = this.getRect(cell);

    if (rect.width > rect.height) {
      rect.x += (rect.width - rect.height) / 2;
      rect.width = rect.height;
    } else if (rect.height > rect.width) {
      rect.y += (rect.height - rect.width) / 2;
      rect.height = rect.width;
    }

    return rect;
  }

  protected abstract offsets(kind: Kind): Record<string, number>;
  public abstract drawFloor(cell: Cell, color?: string): void;
  public abstract drawWall(cd: CellDirection, color?: string): void;
  public abstract drawPillar(cell: Cell, pillar: Pillar, color?: string): void;
  public abstract drawX(cell: Cell, color?: string): void;
  public abstract getRect(cell: Cell): Rect;

  protected translateOffsets(cell: Cell, x: number, y: number): Record<string, number> {
    return Object.fromEntries(
      Object.entries(this.offsets(this.cellKind(cell))).map(([k, v]) => {
        if (k.startsWith('x')) {
          return [k, v + x];
        }
        if (k.startsWith('y')) {
          return [k, v + y];
        }
        return [k, v];
      }),
    );
  }
  //#endregion
  //#region Location
  public parseLocation(p: Location): Cell {
    const [allOrder, zone] = p.split(' ') as [AllOrder, Zone];

    const cells = this.cellsInMaze(allOrder);

    switch (zone) {
      case 'edge': {
        return cells.find((cell) => this.moves(cell, { wall: 'all', inMaze: false }).length > 0)!;
      }

      case 'interior': {
        return cells.find((cell) => this.moves(cell, { wall: 'all', inMaze: false }).length === 0)!;
      }

      // no default
    }
  }

  private parseSpecification(pd: Cell | Location): Cell {
    if (typeof pd === 'string') {
      return this.parseLocation(pd);
    }

    return pd;
  }
  //#endregion
  //#region Bridge
  public bridges(cell: Cell): BridgeLayout[] {
    const pieces = this.bridgeMatrix?.pieces ?? 1;
    return (this.bridgeMatrix?.layouts[this.cellKind(cell)] ?? []).map((layout) => ({
      pieces,
      ...layout,
      // TODO [9.1.2]: this.bridgeMatrix?.connect ?? (this.oppositeMatrix.facing as unknown as Record<Facing, Facing>),
      connect:
        this.bridgeMatrix?.connect ??
        (this.oppositeMatrix.direction as unknown as Record<Direction, Direction>),
      direction: layout.path[0],
    }));
  }
  //#endregion
}

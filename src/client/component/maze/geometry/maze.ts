import {
  create2DArray,
  modulo,
  randomPick,
  randomShuffle,
  toCartesian,
  toPolar,
} from '@technobuddha/library';
import { isObject } from 'lodash-es';

import { type Drawing, type Rect } from '../drawing/drawing.ts';
import { type MazeGenerator } from '../generator/index.ts';

import { Nexus } from './nexus.ts';

export type Direction = string;
export type Pillar = `${Direction}${Direction}`;

export type Kind = number;

export type XY = { x: number; y: number };

export type Move = { x: number; y: number; zone?: 'up' | 'down' };

export type Cell = {
  x: number;
  y: number;
};

export type CellDirection = Cell & {
  direction: Direction;
};

export type Terminus = Cell & {
  direction: Direction;
};

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

export type Directional<T> = Record<Direction, T | false | undefined>;
export type Wall = Directional<true>;
export type Portal = Directional<CellDirection>;

export type CustomDrawingSize = {
  width: number;
  height: number;
  actualWidth: number;
  actualHeight: number;
};

export type DrawingSizes = {
  groupWidth: number;
  groupHeight: number;
  verticalCellsPerGroup?: number;
  horizontalCellsPerGroup?: number;
  topPadding?: number;
  leftPadding?: number;
  bottomPadding?: number;
  rightPadding?: number;
  custom?(this: void, args: CustomDrawingSize): CustomDrawingSize;
};

type ShowDistances = 'none' | 'greyscale' | 'primary' | 'color' | 'spectrum';

type Loop = {
  cell: Cell;
  distance: number;
  loops: Cell[];
  distances: number[];
};

export type MazeProperties = {
  drawing?: Drawing;
  width?: number;
  height?: number;
  cellSize?: number;
  wallSize?: number;
  entrance?: Cell | CellDirection | Location;
  exit?: Cell | CellDirection | Location;
  wrapHorizontal?: boolean;
  wrapVertical?: boolean;

  cellColor?: string;
  wallColor?: string;
  maskColor?: string;
  entranceColor?: string;
  exitColor?: string;
  tunnelColor?: string;
  solutionColor?: string;
  scannedColor?: string;
  avatarColor?: string;
  prunedColor?: string;
  pathColor?: string;
  blockedColor?: string;
  errorColor?: string;
  bridgeColor?: string;
  textColor?: string;

  showDistances?: ShowDistances;
  showCoordinates?: boolean;

  random?(this: void): number;
  plugin?(this: void, maze: Maze): void;
};

export type Matrix = {
  readonly directions: Direction[];
  readonly pillars: Pillar[];
  readonly wall: Record<Kind, Record<Direction, boolean>>;
  readonly opposite: Record<Direction, Direction | Record<Kind, Direction>>;
  readonly inverse: Record<Direction, Direction | Record<Kind, Direction>>;
  readonly rightTurn: Record<Direction, Direction[] | Record<Kind, Direction[]>>;
  readonly leftTurn: Record<Direction, Direction[] | Record<Kind, Direction[]>>;
  readonly straight: Record<Direction, Direction[] | Record<Kind, Direction[]>>;
  readonly move: Record<Kind, Record<Direction, Move | Move[]>>;
  readonly preferred: Record<Kind, Direction[]>;
  readonly angle: Record<Direction, number>;
};

export abstract class Maze {
  public readonly wrapHorizontal: boolean;
  public readonly wrapVertical: boolean;
  public entrance: Terminus = { x: -1, y: -1, direction: '?' };
  public exit: Terminus = { x: -1, y: -1, direction: '?' };
  public solution: CellDirection[] = [];

  public leftOffset = 0;
  public topOffset = 0;
  public bridgePieces = 1;

  public width: NonNullable<MazeProperties['width']> = 25;
  public height: NonNullable<MazeProperties['height']> = 25;
  public readonly wallSize: NonNullable<MazeProperties['wallSize']>;
  public readonly cellSize: NonNullable<MazeProperties['cellSize']>;

  public readonly cellColor: NonNullable<MazeProperties['cellColor']>;
  public readonly wallColor: NonNullable<MazeProperties['wallColor']>;
  public readonly maskColor: NonNullable<MazeProperties['maskColor']>;
  public readonly entranceColor: NonNullable<MazeProperties['entranceColor']>;
  public readonly exitColor: NonNullable<MazeProperties['exitColor']>;
  public readonly tunnelColor: NonNullable<MazeProperties['tunnelColor']>;
  public readonly solutionColor: NonNullable<MazeProperties['solutionColor']>;
  public readonly scannedColor: NonNullable<MazeProperties['scannedColor']>;
  public readonly avatarColor: NonNullable<MazeProperties['avatarColor']>;
  public readonly prunedColor: NonNullable<MazeProperties['prunedColor']>;
  public readonly pathColor: NonNullable<MazeProperties['pathColor']>;
  public readonly blockedColor: NonNullable<MazeProperties['blockedColor']>;
  public readonly errorColor: NonNullable<MazeProperties['errorColor']>;
  public readonly bridgeColor: NonNullable<MazeProperties['bridgeColor']>;
  public readonly textColor: NonNullable<MazeProperties['textColor']>;

  public readonly showDistances: NonNullable<MazeProperties['showDistances']>;
  public readonly showCoordinates: NonNullable<MazeProperties['showCoordinates']>;

  public readonly random: NonNullable<MazeProperties['random']>;

  private readonly entranceSpec: MazeProperties['entrance'];
  private readonly exitSpec: MazeProperties['exit'];
  protected plugin: MazeProperties['plugin'];
  protected readonly requestedWidth: MazeProperties['width'];
  protected readonly requestedHeight: MazeProperties['height'];

  protected drawing: MazeProperties['drawing'];

  public readonly directions: Matrix['directions'];
  public readonly pillars: Matrix['pillars'];
  protected readonly wallMatrix: Matrix['wall'];
  protected readonly oppositeMatrix: Matrix['opposite'];
  protected readonly inverseMatrix: Matrix['inverse'];
  protected readonly rightTurnMatrix: Matrix['rightTurn'];
  protected readonly leftTurnMatrix: Matrix['leftTurn'];
  protected readonly straightMatrix: Matrix['straight'];
  protected readonly moveMatrix: Matrix['move'];
  protected readonly preferredMatrix: Matrix['preferred'];
  protected readonly angleMatrix: Matrix['angle'];

  public hookPreGeneration: ((generator: MazeGenerator) => void) | undefined = undefined;
  public hookPostGeneration: ((generator: MazeGenerator) => void) | undefined = undefined;

  protected nexuses: Nexus[][] = [];

  //#region Construction
  public constructor(
    {
      drawing,
      width: requestedWidth,
      height: requestedHeight,
      cellSize = 21,
      wallSize = 1,
      entrance,
      exit,
      wrapHorizontal = false,
      wrapVertical = false,

      cellColor = 'oklch(0 0 0)',
      wallColor = 'oklch(0.6993 0 0)',
      maskColor = cellColor,
      entranceColor = 'oklch(0.5198 0.176858 142.4953)',
      exitColor = 'oklch(0.628 0.2577 29.23)',
      tunnelColor = 'oklch(0.9544 0.0637 196.13)',
      solutionColor = 'oklch(0.6611 0.115 213.72)',
      scannedColor = 'oklch(0.5789 0.2344 0.51)',
      avatarColor = 'oklch(0.6611 0.115 213.72)',
      prunedColor = 'oklch(0.4446 0.1803 359.81)',
      pathColor = 'oklch(0.8145 0.1672 83.88)',
      blockedColor = 'oklch(0.6298 0.2145 27.83)',
      errorColor = 'oklch(0.8664 0.294827 142.4953)',
      bridgeColor = '#222222', //'oklch(0.4806 0.1597 25.56)',
      textColor = 'oklch(1 0 0)',

      showDistances = 'greyscale',
      showCoordinates = false,

      random = Math.random,
      plugin,
    }: MazeProperties,
    matrix: Matrix,
  ) {
    this.directions = matrix.directions;
    this.pillars = matrix.pillars;
    this.wallMatrix = matrix.wall;
    this.oppositeMatrix = matrix.opposite;
    this.inverseMatrix = matrix.inverse;
    this.rightTurnMatrix = matrix.rightTurn;
    this.leftTurnMatrix = matrix.leftTurn;
    this.straightMatrix = matrix.straight;
    this.moveMatrix = matrix.move;
    this.preferredMatrix = matrix.preferred;
    this.angleMatrix = matrix.angle;

    this.cellSize = cellSize;
    this.wallSize = wallSize;
    this.drawing = drawing;

    this.cellColor = cellColor;
    this.wallColor = wallColor;
    this.maskColor = maskColor;
    this.entranceColor = entranceColor;
    this.exitColor = exitColor;
    this.tunnelColor = tunnelColor;
    this.solutionColor = solutionColor;
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

    this.wrapHorizontal = wrapHorizontal;
    this.wrapVertical = wrapVertical;

    this.random = random;
    this.entranceSpec = entrance;
    this.exitSpec = exit;

    this.requestedWidth = requestedWidth;
    this.requestedHeight = requestedHeight;
    this.plugin = plugin;

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

    for (const cell of this.allCells()) {
      if (this.nexus(cell).mask) {
        const wall = this.nexus(cell).walls;
        for (const direction of Object.keys(wall)) {
          delete wall[direction];
        }
      }
    }
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
          portals: this.initialPortals({ x, y }),
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

  public initialPortals(cell: Cell): Portal {
    return Object.fromEntries(
      Object.keys(this.initialWalls(cell)).map((d) => [
        this.opposite({ ...cell, direction: d }),
        false,
      ]),
    );
  }
  //#endregion
  //#region utility functions
  public randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  public randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
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

  public opposite(cell: CellDirection): Direction {
    if (cell.direction === '?') {
      return '?';
    }

    const opposite = this.oppositeMatrix[cell.direction];
    if (opposite) {
      return isObject(opposite) ? opposite[this.cellKind(cell)] : opposite;
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }

  public inverse(cell: CellDirection): Direction {
    if (cell.direction === '?') {
      return '?';
    }

    const inverse = this.inverseMatrix[cell.direction];
    if (inverse) {
      return isObject(inverse) ? inverse[this.cellKind(cell)] : inverse;
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }

  public rightTurn(cell: CellDirection): Direction[] {
    const rightTurn = this.rightTurnMatrix[cell.direction];
    if (rightTurn) {
      return (Array.isArray(rightTurn) ? rightTurn : rightTurn[this.cellKind(cell)]).filter(
        (d) => d in this.nexus(cell).walls,
      );
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }

  public leftTurn(cell: CellDirection): Direction[] {
    const leftTurn = this.leftTurnMatrix[cell.direction];
    if (leftTurn) {
      return (Array.isArray(leftTurn) ? leftTurn : leftTurn[this.cellKind(cell)]).filter(
        (d) => d in this.nexus(cell).walls,
      );
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }

  public straight(cell: CellDirection, bias = this.random() < 0.5): Direction[] {
    const straight = this.straightMatrix[cell.direction];
    if (straight) {
      const directions = Array.isArray(straight) ? straight : straight[this.cellKind(cell)];
      const validDirections = directions.flatMap((dir) => {
        const dirs = Array.from(dir).filter((d) => d in this.nexus(cell).walls);
        return bias ? dirs : dirs.reverse();
      });
      return validDirections.filter((d) => d !== '');
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }

  public straightest(cell: CellDirection, bias = this.random() < 0.5): Direction {
    const straights = this.straight(cell, bias);
    if (straights.length > 1) {
      return straights[0];
    }

    throw new Error(`(${cell.x},${cell.y}):${cell.direction} has no straight.`);
  }

  public forward(cell: CellDirection, bias = this.random() < 0.5): Direction {
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
    return this.allCells(order).filter((cell) => this.nexus(cell).mask);
  }

  public cellsOnEdge(order: AllOrder = 'top-left'): Cell[] {
    return this.allCells(order).filter((cell) => this.adjacent(cell).some((c) => !this.inMaze(c)));
  }

  public cellsInterior(order: AllOrder = 'top-left'): Cell[] {
    return this.allCells(order).filter((cell) => this.adjacent(cell).every((c) => this.inMaze(c)));
  }

  public deadEnds(): Cell[] {
    return this.cellsInMaze().filter((cell) => this.isDeadEnd(cell));
  }

  public randomCell(): Cell {
    return this.randomPick(this.cellsInMaze())!;
  }

  public removeInteriorWalls(): void {
    for (const cell of this.cellsInMaze()) {
      const wall = this.nexus(cell).walls;
      for (const direction of Object.keys(wall).filter((d) => wall[d])) {
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

      const loopCells = this.validMoves(cell).filter((n) => distances[n.x][n.y] < distance - 1);
      if (loopCells.length > 0) {
        loops.push({
          cell,
          loops: loopCells,
          distance,
          distances: loopCells.map((l) => distances[l.x][l.y]),
        });
      }

      const moves = this.validMoves(cell).filter((n) => distances[n.x][n.y] === Infinity);
      for (const move of moves) {
        distances[move.x][move.y] = distance + 1;
        queue.unshift(move);
      }
    }

    const unreachable = this.cellsInMaze().filter((cell) => distances[cell.x][cell.y] === Infinity);

    return { maxDistance, maxCell, distances, unreachable, loops };
  }

  public braid(): void {
    const deadEnds = this.deadEnds();

    while (deadEnds.length > 0) {
      const index = Math.floor(this.random() * deadEnds.length);
      const cell = deadEnds[index];

      deadEnds.splice(index, 1);

      const neighbor = this.randomPick(
        this.neighbors(cell).filter((c) => this.nexus(cell).walls[c.direction]),
      );
      if (neighbor) {
        this.removeWall(cell, neighbor.direction);
        const nindex = deadEnds.findIndex((c) => this.isSame(c, neighbor));
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

    const outsideEntrance = this.randomPick(this.adjacent(entrance).filter((c) => !this.inMaze(c)));
    if (outsideEntrance) {
      this.entrance = { ...entrance, direction: this.opposite(outsideEntrance) };
      this.nexus(this.entrance).walls[outsideEntrance.direction] = false;
    } else {
      this.entrance = {
        ...entrance,
        direction: this.randomPick(this.validMoves(entrance))?.direction ?? '?',
      };
    }

    const outsideExit = this.randomPick(this.adjacent(exit).filter((c) => !this.inMaze(c)));
    if (outsideExit) {
      this.exit = { ...exit, direction: outsideExit.direction };
      this.nexus(this.exit).walls[this.exit.direction] = false;
    } else {
      this.exit = { ...exit, direction: '?' };
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

  public clear(color?: string): void {
    if (this.drawing) {
      this.drawing.clear(color, this.leftOffset, this.topOffset);
    }
  }

  public draw(): void {
    if (this.drawing) {
      this.clear();

      for (const cell of this.cellsInMaze()) {
        this.drawCell(cell);

        for (const outside of this.adjacent(cell).filter((c) => !this.inMaze(c))) {
          if (this.nexus(cell).walls[outside.direction]) {
            this.drawOutsideWall({ ...outside, direction: this.opposite(outside) });
          } else {
            this.drawDoor({ ...outside, direction: this.opposite(outside) });
          }

          for (const pillar of this.pillars) {
            if (pillar.includes(this.opposite(outside))) {
              this.drawOutsidePillar(outside, pillar);
            }
          }
        }
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

  public drawDistances(point = this.entrance): void {
    if (this.drawing) {
      const { maxDistance, distances, unreachable, loops } = this.analyze(point);

      if (unreachable.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`Unreachable cells: `, unreachable);
      }

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

      this.drawMasks();

      if (loops.length > 0) {
        for (const loop of loops) {
          // eslint-disable-next-line no-console
          console.log(
            `Loop detected from {x: ${loop.cell.x}, y: ${loop.cell.y} :: ${loop.distance}} with ${loop.loops.map((l, i) => `{x: ${l.x}, y:${l.y} :: ${loop.distances[i]}}`).join(' ')}`,
          );

          this.drawX(loop.cell, this.errorColor);
        }
      }
    }
  }

  public drawSolution(color = this.solutionColor): void {
    if (this.drawing) {
      this.drawDistances();

      for (const cell of this.solution) {
        this.drawPath(cell, color);
      }

      this.drawPath(this.drawCell(this.exit), color);
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

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public isSame(cell1: Cell | undefined | null, cell2: Cell | undefined | null): boolean {
    return cell1?.x === cell2?.x && cell1?.y === cell2?.y;
  }

  public isDeadEnd(cell: Cell): boolean {
    const wall = this.nexus(cell).walls;
    const dirs = Object.keys(wall);

    return (
      !this.isSame(cell, this.entrance) &&
      !this.isSame(cell, this.exit) &&
      dirs.reduce((acc, dir) => acc + (wall[dir] ? 1 : 0), 0) === dirs.length - 1
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

  public addWall(cell: Cell, direction: Direction, draw = true): void {
    if (this.inMaze(cell)) {
      this.nexus(cell).walls[direction] = true;
      if (draw) {
        this.drawCell(cell, this.cellColor, this.wallColor);
      }

      const cell2 = this.move(cell, direction);
      if (cell2 && this.inMaze(cell2)) {
        this.nexus({ x: cell2.x, y: cell2.y }).walls[this.opposite(cell2)] = true;
        if (draw) {
          this.drawCell(cell2, this.cellColor, this.wallColor);
        }
      }
    }
  }

  public removeWall(cell: Cell, direction: Direction): void {
    if (this.inMaze(cell)) {
      this.nexus(cell).walls[direction] = false;
      this.drawCell(cell, this.cellColor, this.wallColor);

      const cell2 = this.move(cell, direction);
      if (cell2 && this.inMaze(cell2)) {
        this.nexus(cell2).walls[this.opposite(cell2)] = false;
        this.drawCell(cell2, this.cellColor, this.wallColor);
      }
    }
  }

  public shift(cell: Cell, direction: Direction): CellDirection | undefined {
    let move = this.moveMatrix[this.cellKind(cell)][direction];

    if (move) {
      if (Array.isArray(move)) {
        move = move[modulo(cell.y, move.length)];
      }

      return { ...this.resolveMove(cell, move), direction };
    }
    return undefined;
  }

  public move(cell: Cell, dir: Direction): CellDirection | undefined {
    let next = this.shift(cell, dir);

    if (next) {
      while (true) {
        const portal: CellDirection | undefined | false =
          this.inMaze(next) ? this.nexus(next).portals[next.direction] : false;
        if (portal) {
          next = portal;
        } else {
          break;
        }
      }

      return next;
    }
    return undefined;
  }

  public resolveMove(cell: Cell, move: Move): Cell {
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

  public adjacent(cell: Cell): CellDirection[] {
    return Object.keys(this.nexus(cell).walls)
      .map((direction) => this.move(cell, direction))
      .filter((c) => c != null);
  }

  public neighbors(cell: Cell): CellDirection[] {
    return this.adjacent(cell).filter((c) => this.inMaze(c));
  }

  public validMoves(cell: Cell): CellDirection[] {
    return this.neighbors(cell).filter((cd) => !this.nexus(cell).walls[cd.direction]);
  }

  public preferreds(cell: Cell): string[] {
    return this.neighbors(cell)
      .filter((cd) => this.preferredMatrix[this.cellKind(cell)].includes(cd.direction))
      .map((cd) => cd.direction);
  }

  public abstract cellKind(cell: Cell): Kind;
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
        // todo : this.nexus(cell).bridge ? this.bridgeColor
      : cellColor,
    );

    this.drawWalls(cell, wallColor);
    this.drawPillars(cell, wallColor);

    if (this.showCoordinates) {
      this.drawText(cell, cell.x === 0 ? cell.y.toString() : cell.x.toString());
    }

    return cell;
  }

  public drawWalls(cell: Cell, color = this.wallColor): void {
    const { walls, portals } = this.nexus(cell);

    for (const direction of Object.keys(walls)) {
      if (walls[direction]) {
        if (portals[this.opposite({ ...cell, direction })]) {
          const move = this.shift(cell, direction);
          if (move && this.inMaze(move) && !this.nexus(move).walls[this.inverse(move)]) {
            this.drawTunnel({ ...cell, direction }, color);
            this.drawDoor({ ...cell, direction }, color);
            this.drawWall({ ...cell, direction }, this.tunnelColor);
            continue;
          }
        }
        this.drawWall({ ...cell, direction }, color);
      } else {
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

  public drawTunnel(cell: CellDirection, color = this.wallColor): void {
    if (this.drawing) {
      this.drawDoor(cell, color);
      this.drawWall(cell, this.tunnelColor);
    }
  }

  public drawDoor(_cell: CellDirection, _color: string = this.wallColor): void {
    // Most mazes don't have to draw a door, it just the lack of a wall.
  }

  public drawOutsideWall(cell: CellDirection, color = this.wallColor): void {
    this.drawWall(cell, color);
  }

  public drawOutsidePillar(cell: Cell, pillar: Pillar, color = this.wallColor): void {
    this.drawPillar(cell, pillar, color);
  }

  public drawPath(cell: CellDirection, color = this.pathColor): void {
    if (this.drawing) {
      const rect = this.cellRect(cell);
      if (cell.direction === '?') {
        this.renderCircle(rect, color);
      } else {
        const angle = this.angleMatrix[cell.direction];

        this.renderArrow(rect, angle, color);
      }
    }
  }

  protected renderArrow(rect: Rect, angle: number, color: string): void {
    if (this.drawing) {
      const coords: XY[] = [
        { x: 1, y: 0 },
        { x: -1, y: 2 / 3 },
        { x: 0, y: 0 },
        { x: -1, y: -2 / 3 },
      ];

      // scale
      for (const c of coords) {
        c.x = (c.x * rect.w) / 2;
        c.y = (c.y * rect.h) / 2;
      }

      // rotate
      for (const c of coords) {
        const pc = toPolar(c);
        pc.angle += (angle / 180) * Math.PI;
        const { x, y } = toCartesian(pc);
        c.x = x;
        c.y = y;
      }

      this.drawing.polygon(
        coords.map((c) => ({ x: rect.x + rect.w / 2 + c.x, y: rect.y + rect.h / 2 - c.y })),
        color,
      );
    }
  }

  public drawAvatar(cell: Cell, color = this.avatarColor): void {
    if (this.drawing) {
      this.drawCell(cell);
      const rect = this.cellRect(cell);

      this.drawing.circle(
        { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 },
        Math.abs(rect.w) / 4,
        color,
      );
    }
  }

  protected renderCircle(rect: Rect, color: string): void {
    if (this.drawing) {
      this.drawing.circle(
        { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 },
        Math.abs(rect.w) / 4,
        color,
      );
    }
  }

  protected cellRect(cell: Cell): Rect {
    const rect = this.getRect(cell);

    if (rect.w > rect.h) {
      rect.x += (rect.w - rect.h) / 2;
      rect.w = rect.h;
    } else if (rect.h > rect.w) {
      rect.y += (rect.h - rect.w) / 2;
      rect.h = rect.w;
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
        return cells.find((cell) => this.adjacent(cell).some((c) => !this.inMaze(c)))!;
      }

      case 'interior': {
        return cells.find((cell) => this.adjacent(cell).every((c) => this.inMaze(c)))!;
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
}

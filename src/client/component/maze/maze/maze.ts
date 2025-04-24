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

export type CellPillar = Cell & {
  pillar: Pillar;
};

export type Overrides = { walls?: Wall[][] };

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

export type Wall = Record<Direction, boolean | undefined>;

export type DrawingSizes = {
  fixedWidth?: number;
  fixedHeight?: number;
  groupWidth: number;
  groupHeight: number;
  verticalCellsPerGroup?: number;
  horizontalCellsPerGroup?: number;
  topPadding?: number;
  leftPadding?: number;
  bottomPadding?: number;
  rightPadding?: number;
  custom?(
    this: void,
    args: { width: number; height: number; actualWidth: number; actualHeight: number },
  ): { width: number; height: number; actualWidth: number; actualHeight: number };
};

type ShowDistances = 'none' | 'greyscale' | 'primary' | 'color' | 'spectrum';

export type MazeProperties = {
  drawing?: Drawing;
  width?: number;
  height?: number;
  cellSize?: number;
  cellColor?: string;
  wallSize?: number;
  wallColor?: string;
  maskColor?: string;
  entrance?: Cell | CellDirection | Location;
  exit?: Cell | CellDirection | Location;
  entranceColor?: string;
  exitColor?: string;
  random?(this: void): number;
  plugin?(this: void, maze: Maze): void;
  wrapHorizontal?: boolean;
  wrapVertical?: boolean;
  showDistances?: ShowDistances;
  solutionColor?: string;
};

export type DirectionMatrix = Direction[];
export type PillarMatrix = Pillar[];
export type WallMatrix = Record<Kind, Record<Direction, boolean>>;
export type OppositeMatrix = Record<Direction, Direction | Record<Kind, Direction>>;
export type TurnMatrix = Record<Direction, Direction[] | Record<Kind, Direction[]>>;
export type AngleMatrix = Record<Direction, number>;
export type MoveMatrix = Record<Kind, Record<Direction, Move | Move[]>>;
export type EdgesMatrix = Record<Kind, Direction[]>;
export type PathMatrix = Record<Direction, number>;

export abstract class Maze {
  public width: NonNullable<MazeProperties['width']> = 25;
  public height: NonNullable<MazeProperties['height']> = 25;
  public readonly cellSize: NonNullable<MazeProperties['cellSize']>;
  public readonly cellColor: NonNullable<MazeProperties['cellColor']>;
  public readonly wallSize: NonNullable<MazeProperties['wallSize']>;
  public readonly wallColor: NonNullable<MazeProperties['wallColor']>;
  public readonly maskColor: NonNullable<MazeProperties['maskColor']>;
  public readonly wrapHorizontal: boolean;
  public readonly wrapVertical: boolean;
  public readonly showDistances: ShowDistances;
  public entrance: Terminus = { x: -1, y: -1, direction: '?' };
  public exit: Terminus = { x: -1, y: -1, direction: '?' };
  public solution: CellDirection[] = [];
  public solutionColor: string;

  public readonly directions: DirectionMatrix;
  public readonly pillars: PillarMatrix;
  public walls: Wall[][] = [];
  public distances: number[][] = [];
  public mask: boolean[][] = [];

  protected leftOffset = 0;
  protected topOffset = 0;

  protected readonly random: NonNullable<MazeProperties['random']>;

  protected entranceColor: NonNullable<MazeProperties['entranceColor']>;
  protected exitColor: NonNullable<MazeProperties['exitColor']>;
  protected drawing: MazeProperties['drawing'];

  private readonly wallMatrix: WallMatrix;
  private readonly oppositeMatrix: OppositeMatrix;
  private readonly rightTurnMatrix: TurnMatrix;
  private readonly leftTurnMatrix: TurnMatrix;
  private readonly straightMatrix: TurnMatrix;
  private readonly moveMatrix: MoveMatrix;
  private readonly edgesMatrix: EdgesMatrix;
  private readonly pathMatrix: PathMatrix;

  private readonly entranceSpec: MazeProperties['entrance'];
  private readonly exitSpec: MazeProperties['exit'];
  protected plugin: MazeProperties['plugin'];
  protected readonly requestedWidth: MazeProperties['width'];
  protected readonly requestedHeight: MazeProperties['height'];

  public constructor(
    {
      drawing,
      cellSize = 21,
      cellColor = 'black',
      wallSize = 1,
      wallColor = '#9e9e9e',
      maskColor = cellColor,
      entrance,
      exit,
      entranceColor = 'green',
      exitColor = 'red',
      wrapHorizontal = false,
      wrapVertical = false,
      random = Math.random,
      showDistances = 'primary',
      solutionColor = '#08A4BD',
      width: requestedWidth,
      height: requestedHeight,
      plugin,
    }: MazeProperties,
    directions: DirectionMatrix,
    pillars: PillarMatrix,
    wallMatrix: WallMatrix,
    oppositeMatrix: OppositeMatrix,
    rightTurnMatrix: TurnMatrix,
    leftTurnMatrix: TurnMatrix,
    straightMatrix: TurnMatrix,
    moveMatrix: MoveMatrix,
    edgesMatrix: EdgesMatrix,
    pathMatrix: PathMatrix,
  ) {
    this.wallMatrix = wallMatrix;
    this.oppositeMatrix = oppositeMatrix;
    this.rightTurnMatrix = rightTurnMatrix;
    this.leftTurnMatrix = leftTurnMatrix;
    this.straightMatrix = straightMatrix;
    this.moveMatrix = moveMatrix;
    this.edgesMatrix = edgesMatrix;
    this.pathMatrix = pathMatrix;

    this.cellSize = cellSize;
    this.wallSize = wallSize;
    this.drawing = drawing;

    this.directions = directions;
    this.pillars = pillars;
    this.cellColor = cellColor;
    this.wallColor = wallColor;
    this.maskColor = maskColor;

    this.wrapHorizontal = wrapHorizontal;
    this.wrapVertical = wrapVertical;
    this.showDistances = showDistances;

    this.random = random;
    this.entranceSpec = entrance;
    this.exitSpec = exit;
    this.entranceColor = entranceColor;
    this.exitColor = exitColor;
    this.solutionColor = solutionColor;

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

    this.createWalls();

    this.distances = create2DArray(this.width, this.height, Infinity);

    this.mask = create2DArray(this.width, this.height, false);
    this.plugin?.(this);

    for (const cell of this.cellsInMaze()) {
      if (this.neighbors(cell).length === 0) {
        this.mask[cell.x][cell.y] = true;
      }
    }

    for (let x = 0; x < this.mask.length; ++x) {
      for (let y = 0; y < this.mask[x].length; ++y) {
        if (this.mask[x][y]) {
          this.walls[x][y] = {};
        }
      }
    }
  }

  public createWalls(): void {
    this.walls = create2DArray(this.width, this.height, (x, y) => this.initialWalls({ x, y }));
  }

  //#region utility functions
  protected randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  protected randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
  }
  //#endregion
  //#region Direction
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

  public rightTurn(cell: CellDirection): Direction[] {
    const rightTurn = this.rightTurnMatrix[cell.direction];
    if (rightTurn) {
      return (Array.isArray(rightTurn) ? rightTurn : rightTurn[this.cellKind(cell)]).filter(
        (d) => d in this.walls[cell.x][cell.y],
      );
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }

  public leftTurn(cell: CellDirection): Direction[] {
    const leftTurn = this.leftTurnMatrix[cell.direction];
    if (leftTurn) {
      return (Array.isArray(leftTurn) ? leftTurn : leftTurn[this.cellKind(cell)]).filter(
        (d) => d in this.walls[cell.x][cell.y],
      );
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }

  public straight(cell: CellDirection): Direction[] {
    const straight = this.straightMatrix[cell.direction];
    if (straight) {
      const directions = Array.isArray(straight) ? straight : straight[this.cellKind(cell)];
      const validDirections = directions.flatMap((dir) => {
        const dirs = Array.from(dir).filter((d) => d in this.walls[cell.x][cell.y]);
        return this.random() < 0.5 ? dirs : dirs.reverse();
      });
      return validDirections.filter((d) => d !== '');
    }

    throw new Error(`"${cell.direction}" is not a valid direction`);
  }
  //#endregion
  //#region Maze
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
    return this.allCells(order).filter((cell) => this.mask[cell.x][cell.y]);
  }

  public deadEnds({ walls = this.walls }: Overrides = {}): Cell[] {
    return this.cellsInMaze().filter((cell) => this.isDeadEnd(cell, { walls }));
  }

  public randomCell(): Cell {
    return this.randomPick(this.cellsInMaze())!;
  }

  public removeInteriorWalls(): void {
    for (const cell of this.cellsInMaze()) {
      const wall = this.walls[cell.x][cell.y];
      for (const direction of Object.keys(wall).filter((d) => wall[d])) {
        const move = this.move(cell, direction);
        if (move && this.inMaze(move)) {
          wall[direction] = false;
        }
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public freezeWalls(): void {
    // This is a no-op for most kinds of mazes
  }

  public cloneWalls(): Wall[][] {
    return structuredClone(this.walls);
  }

  public computeDistances(point: Cell = this.entrance): { maxDistance: number; maxCell: Cell } {
    const queue: Cell[] = [];
    queue.unshift(point);

    for (const row of this.distances) {
      for (let col = 0; col < row.length; ++col) {
        row[col] = Infinity;
      }
    }
    this.distances[point.x][point.y] = 0;

    let maxDistance = 1;
    let maxCell = point;
    while (queue.length > 0) {
      const cell = queue.pop()!;
      const distance = this.distances[cell.x][cell.y];

      if (distance > maxDistance) {
        maxDistance = distance;
        maxCell = cell;
      }

      const moves = this.validMoves(cell).filter((n) => this.distances[n.x][n.y] === Infinity);
      for (const move of moves) {
        this.distances[move.x][move.y] = distance + 1;
        queue.unshift(move);
      }
    }

    return { maxDistance, maxCell };
  }

  public braid(): void {
    const deadEnds = this.deadEnds();

    while (deadEnds.length > 0) {
      const index = Math.floor(this.random() * deadEnds.length);
      const cell = deadEnds[index];

      deadEnds.splice(index, 1);

      const neighbor = this.randomPick(
        this.neighbors(cell).filter((c) => this.walls[cell.x][cell.y][c.direction]),
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
      exit = this.computeDistances(entrance).maxCell;
    } else if (this.exitSpec) {
      exit = this.parseSpecification(this.exitSpec);
      entrance = this.computeDistances(exit).maxCell;
    } else {
      entrance = this.computeDistances(this.randomCell()).maxCell;
      exit = this.computeDistances(entrance).maxCell;
    }

    const outsideEntrance = this.randomPick(this.adjacent(entrance).filter((c) => !this.inMaze(c)));
    if (outsideEntrance) {
      this.entrance = { ...entrance, direction: this.opposite(outsideEntrance) };
      this.walls[this.entrance.x][this.entrance.y][outsideEntrance.direction] = false;
    } else {
      this.entrance = {
        ...entrance,
        direction: this.randomPick(this.validMoves(entrance))?.direction ?? '?',
      };
    }

    const outsideExit = this.randomPick(this.adjacent(exit).filter((c) => !this.inMaze(c)));
    if (outsideExit) {
      this.exit = { ...exit, direction: outsideExit.direction };
      this.walls[this.exit.x][this.exit.y][this.exit.direction] = false;
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
        if (this.entrance.x === cell.x && this.entrance.y === cell.y) {
          this.drawCell(cell, 'green');
        } else if (this.exit.x === cell.x && this.exit.y === cell.y) {
          this.drawCell(cell, 'red');
        } else {
          this.drawCell(cell);
        }

        for (const outside of this.adjacent(cell).filter((c) => !this.inMaze(c))) {
          if (this.walls[cell.x][cell.y][outside.direction]) {
            this.drawWall({ ...outside, direction: this.opposite(outside) });
          }

          for (const pillar of this.pillars) {
            if (pillar.includes(this.opposite(outside))) {
              this.drawPillar({ ...outside, pillar });
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
      const { maxDistance } = this.computeDistances(point);

      for (const cell of this.cellsInMaze()) {
        if (this.entrance.x === cell.x && this.entrance.y === cell.y) {
          this.drawCell(cell, 'green');
        } else if (this.exit.x === cell.x && this.exit.y === cell.y) {
          this.drawCell(cell, 'red');
        } else {
          const distance = this.distances[cell.x][cell.y];
          let color: string | undefined = undefined;

          if (distance === Infinity) {
            color = 'black';
          } else {
            switch (this.showDistances) {
              case 'none': {
                break;
              }

              case 'greyscale': {
                const grey = (1 - distance / maxDistance) * 0.35 + 0.15;

                color = `rgba(${255 * grey}, ${255 * grey}, ${255 * grey})`;
                break;
              }

              case 'primary': {
                color = `hsl(212, 72.3%, ${3 + 35 * (1 - this.distances[cell.x][cell.y] / maxDistance)}%)`;
                break;
              }

              case 'color': {
                color = `hsl(270, 100%, ${15 + 35 * (1 - this.distances[cell.x][cell.y] / maxDistance)}%)`;
                break;
              }

              case 'spectrum': {
                color = `hsl(${(this.distances[cell.x][cell.y] * 360) / maxDistance}, 25%, 50%)`;
                break;
              }
              // no default
            }
          }

          if (color) {
            this.drawFloor(cell);
            this.drawCell(cell, color);
          }
        }
      }

      this.drawMasks();
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
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public isSame(cell1: Cell, cell2: Cell): boolean {
    return cell1.x === cell2.x && cell1.y === cell2.y;
  }

  public isDeadEnd(cell: Cell, { walls = this.walls }: Overrides = {}): boolean {
    const wall = walls[cell.x][cell.y];
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
      !this.mask[cell.x][cell.y]
    );
  }

  protected initialWalls(cell: Cell): Wall {
    const initialWalls = this.wallMatrix[this.cellKind(cell)];

    if (initialWalls) {
      return { ...initialWalls };
    }

    throw new Error(`No initial walls for cell (${cell.x}, ${cell.y}) kind ${this.cellKind(cell)}`);
  }

  public addWall(
    cell: Cell,
    direction: Direction,
    { walls = this.walls }: Overrides = {},
    draw = true,
  ): void {
    if (this.inMaze(cell)) {
      walls[cell.x][cell.y][direction] = true;
      if (draw) {
        this.drawCell(cell, this.cellColor, this.wallColor, { walls });
      }

      const cell2 = this.move(cell, direction);
      if (cell2 && this.inMaze(cell2)) {
        walls[cell2.x][cell2.y][this.opposite(cell2)] = true;
        if (draw) {
          this.drawCell(cell2, this.cellColor, this.wallColor, { walls });
        }
      }
    }
  }

  public removeWall(
    cell: Cell,
    direction: Direction,
    { walls = this.walls }: Overrides = {},
  ): void {
    if (this.inMaze(cell)) {
      walls[cell.x][cell.y][direction] = false;
      this.drawCell(cell, this.cellColor, this.wallColor, { walls });

      const cell2 = this.move(cell, direction);
      if (cell2 && this.inMaze(cell2)) {
        walls[cell2.x][cell2.y][this.opposite(cell2)] = false;
        this.drawCell(cell2, this.cellColor, this.wallColor, { walls });
      }
    }
  }

  public move(cell: Cell, direction: Direction): CellDirection | null {
    let move = this.moveMatrix[this.cellKind(cell)][direction];

    if (move) {
      if (Array.isArray(move)) {
        move = move[modulo(cell.y, move.length)];
      }

      let { x, y } = cell;

      if (move.zone) {
        switch (move.zone) {
          case 'up': {
            x *= 2;
            break;
          }

          case 'down': {
            x = Math.floor(x / 2);
            break;
          }

          // no default
        }
      }

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

      return { x, y, direction };
    }
    return null;
  }

  public adjacent(cell: Cell): CellDirection[] {
    return Object.keys(this.walls[cell.x][cell.y])
      .map((direction) => this.move(cell, direction))
      .filter((c) => c != null);
  }

  public neighbors(cell: Cell): CellDirection[] {
    return this.adjacent(cell).filter((c) => this.inMaze(c));
  }

  public validMoves(cell: Cell, { walls = this.walls }: Overrides = {}): CellDirection[] {
    return this.neighbors(cell).filter((cd) => !walls[cell.x][cell.y][cd.direction]);
  }

  public edges(cell: Cell): string[] {
    return this.neighbors(cell)
      .filter((cd) => this.edgesMatrix[this.cellKind(cell)].includes(cd.direction))
      .map((cd) => cd.direction);
  }

  protected abstract cellKind(cell: Cell): Kind;
  //#endregion
  //#region Cell Drawing
  public drawCell<T extends Cell>(
    cell: T,
    cellColor = this.cellColor,
    wallColor = this.wallColor,
    { walls = this.walls }: Overrides = {},
  ): T {
    this.drawFloor(
      cell,
      this.isSame(cell, this.entrance) ? this.entranceColor
      : this.isSame(cell, this.exit) ? this.exitColor
      : cellColor,
    );

    const wall = walls[cell.x][cell.y];
    for (const direction of Object.keys(wall)) {
      if (wall[direction]) {
        this.drawWall({ ...cell, direction }, wallColor);
      }
    }

    for (const pillar of this.pillars) {
      if (pillar[0] in wall && pillar[1] in wall) {
        this.drawPillar({ ...cell, pillar }, this.wallColor);
      }
    }

    return cell;
  }

  public drawText(cell: Cell, text: string, color = 'black'): void {
    if (this.drawing) {
      this.drawing.text(this.getRect(cell), text, color);
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

  public drawAvatar(cell: Cell, color = 'cyan'): void {
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

  public drawPath(cell: CellDirection, color = 'cyan'): void {
    if (this.drawing) {
      const rect = this.cellRect(cell);
      if (cell.direction === '?') {
        this.renderCircle(rect, color);
      } else {
        const angle = this.pathMatrix[cell.direction];

        this.renderArrow(rect, angle, color);
      }
    }
  }

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

  protected abstract offsets(kind: Kind): Record<string, number>;
  public abstract drawFloor(cell: Cell, color?: string): void;
  public abstract drawWall(cd: CellDirection, color?: string): void;
  public abstract drawPillar(cell: CellPillar, color?: string): void;
  public abstract drawX(cell: Cell, color?: string): void;
  public abstract getRect(cell: Cell): Rect;
  //#endregion
  //#region Location
  private parseLocation(p: Location): Cell {
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

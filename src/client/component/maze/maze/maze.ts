import {
  create2DArray,
  modulo,
  randomPick,
  randomShuffle,
  toCartesian,
  toPolar,
} from '@technobuddha/library';

import { animate } from '../drawing/animate.ts';
import { type Drawing, type Rect } from '../drawing/drawing.ts';

export type Direction = string;
export type Pillar = `${Direction}${Direction}`;

export type Kind = number;

export type XY = { x: number; y: number };

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

type Location =
  | 'top left'
  // | 'top middle'
  | 'top right'
  | 'bottom left'
  // | 'bottom middle'
  | 'bottom right'
  // | 'middle left'
  // | 'middle'
  // | 'middle right'
  | 'left top'
  // | 'left middle'
  | 'left bottom'
  | 'right top'
  // | 'right middle'
  | 'right bottom'
  | 'random';

export type Overrides = { walls?: Wall[][] };

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
  mask?(this: void, maze: Maze): void;
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

export type Wall = Record<Direction, boolean | undefined>;

export type DrawingSizes = {
  groupWidth: number;
  groupHeight: number;
  verticalCellsPerGroup?: number;
  horizontalCellsPerGroup?: number;
  topPadding?: number;
  leftPadding?: number;
  bottomPadding?: number;
  rightPadding?: number;
};

export abstract class Maze {
  public readonly width: NonNullable<MazeProperties['width']>;
  public readonly height: NonNullable<MazeProperties['height']>;
  public readonly cellSize: NonNullable<MazeProperties['cellSize']>;
  public readonly cellColor: NonNullable<MazeProperties['cellColor']>;
  public readonly wallSize: NonNullable<MazeProperties['wallSize']>;
  public readonly wallColor: NonNullable<MazeProperties['wallColor']>;
  public readonly maskColor: NonNullable<MazeProperties['maskColor']>;
  public entrance: Terminus = { x: -1, y: -1, direction: '?' };
  public exit: Terminus = { x: -1, y: -1, direction: '?' };

  public readonly directions: Direction[];
  public readonly pillars: Pillar[];
  public readonly walls: Wall[][];
  public readonly distances: number[][];
  public readonly mask: boolean[][];

  protected readonly random: NonNullable<MazeProperties['random']>;

  protected entranceColor: NonNullable<MazeProperties['entranceColor']>;
  protected exitColor: NonNullable<MazeProperties['exitColor']>;
  protected drawing: MazeProperties['drawing'];

  private readonly wallMatrix: Record<Kind, Record<Direction, boolean>>;
  private readonly oppositeMatrix: Record<Direction, Direction>;
  private readonly rightTurnMatrix: Record<Direction, Direction[]>;
  private readonly leftTurnMatrix: Record<Direction, Direction[]>;
  private readonly moveMatrix: Record<Kind, Record<Direction, XY | XY[]>>;
  private readonly sidesMatrix: Record<Kind, number>;
  private readonly edgesMatrix: Record<Kind, Direction[]>;
  private readonly pathMatrix: Record<Direction, number>;

  private readonly entranceSpec: MazeProperties['entrance'];
  private readonly exitSpec: MazeProperties['exit'];

  public constructor(
    {
      drawing,
      width,
      height,
      cellSize = 21,
      cellColor = 'black',
      wallSize = 1,
      wallColor = 'white',
      maskColor = cellColor,
      entrance,
      exit,
      entranceColor = 'green',
      exitColor = 'red',
      random = Math.random,
      mask,
    }: MazeProperties,
    directions: Direction[],
    pillars: Pillar[],
    wallMatrix: Record<Kind, Record<Direction, boolean>>,
    oppositeMatrix: Record<Direction, Direction>,
    rightTurnMatrix: Record<Direction, Direction[]>,
    leftTurnMatrix: Record<Direction, Direction[]>,
    moveMatrix: Record<Kind, Record<Direction, XY | XY[]>>,
    sidesMatrix: Record<Kind, number>,
    edgesMatrix: Record<Kind, Direction[]>,
    pathMatrix: Record<Direction, number>,
  ) {
    this.wallMatrix = wallMatrix;
    this.oppositeMatrix = oppositeMatrix;
    this.rightTurnMatrix = rightTurnMatrix;
    this.leftTurnMatrix = leftTurnMatrix;
    this.moveMatrix = moveMatrix;
    this.sidesMatrix = sidesMatrix;
    this.edgesMatrix = edgesMatrix;
    this.pathMatrix = pathMatrix;

    this.cellSize = cellSize;
    this.wallSize = wallSize;
    this.drawing = drawing;

    const { cellsWidth, cellsHeight } = this.computeSize({ drawing, width, height });
    this.width = cellsWidth;
    this.height = cellsHeight;

    this.directions = directions;
    this.pillars = pillars;
    this.cellColor = cellColor;
    this.wallColor = wallColor;
    this.maskColor = maskColor;

    this.random = random;
    this.entranceSpec = entrance;
    this.exitSpec = exit;
    this.entranceColor = entranceColor;
    this.exitColor = exitColor;

    this.walls = create2DArray(this.width, this.height, (x, y) => this.initialWalls({ x, y }));
    this.distances = create2DArray(this.width, this.height, Infinity);

    this.mask = create2DArray(this.width, this.height, false);
    mask?.(this);

    for (const cell of this.all()) {
      if (this.neighbors(cell).length === 0) {
        this.mask[cell.x][cell.y] = true;
      }
    }

    for (const cell of this.all()) {
      if (this.mask[cell.x][cell.y]) {
        this.walls[cell.x][cell.y] = {};
      }
    }
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
  public opposite(direction: Direction): Direction {
    if (direction === '?') {
      return '?';
    }

    const opposite = this.oppositeMatrix[direction];
    if (opposite) {
      return opposite;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public rightTurn(direction: Direction): Direction[] {
    const rightTurn = this.rightTurnMatrix[direction];
    if (rightTurn) {
      return rightTurn;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }

  public leftTurn(direction: Direction): Direction[] {
    const leftTurn = this.leftTurnMatrix[direction];
    if (leftTurn) {
      return leftTurn;
    }

    throw new Error(`"${direction}" is not a valid direction`);
  }
  //#endregion
  //#region Maze

  public all(order: AllOrder = 'top-left'): Cell[] {
    const cells = create2DArray(this.width, this.height, (x, y) => ({ x, y }))
      .flat()
      .filter(({ x, y }) => this.inMaze({ x, y }));

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

  public deadEnds({ walls = this.walls }: Overrides = {}): Cell[] {
    const ends: Cell[] = [];

    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        if (this.isDeadEnd({ x, y }, { walls })) {
          ends.push({ x, y });
        }
      }
    }

    return ends;
  }

  public randomCell(): Cell {
    return this.randomPick(this.all())!;
  }

  public removeInteriorWalls(): void {
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        for (const neighbor of this.neighbors({ x, y })) {
          this.removeWall({ x, y }, neighbor.direction);
        }
      }
    }
  }

  public cloneWalls(): Wall[][] {
    return this.walls.map((row) => [...structuredClone(row)]);
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

      const neighbors = this.randomShuffle(
        this.validMoves(cell).filter((n) => this.distances[n.x][n.y] === Infinity),
      );

      for (const neighbor of neighbors) {
        this.distances[neighbor.x][neighbor.y] = distance + 1;
        queue.unshift(neighbor);
      }
    }

    return { maxDistance, maxCell };
  }

  public async braid(): Promise<void> {
    for (;;) {
      const cell = this.randomPick(this.deadEnds());
      if (cell) {
        const neighbor = this.randomPick(
          this.neighbors(cell).filter((c) => this.walls[cell.x][cell.y][c.direction]),
        );
        if (neighbor) {
          await animate(() => this.removeWall(cell, neighbor.direction));
        }
      } else {
        break;
      }
    }
  }

  public addTermini(): this {
    const entrance: Cell =
      this.entranceSpec ?
        this.parseSpecification(this.entranceSpec)
      : this.computeDistances(this.randomCell()).maxCell;

    const exit: Cell =
      this.exitSpec ?
        this.parseSpecification(this.exitSpec)
      : this.computeDistances(entrance).maxCell;

    const outsideEntrance = this.randomPick(this.adjacent(entrance).filter((c) => !this.inMaze(c)));
    if (outsideEntrance) {
      this.entrance = { ...entrance, direction: this.opposite(outsideEntrance.direction) };
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
  public prepareDrawing(drawing?: Drawing): void {
    const replaced = this.drawing !== drawing;

    this.drawing = drawing;
    if (replaced) {
      this.clear();
    }
  }

  private computeSize({ width, height }: { drawing?: Drawing; width?: number; height?: number }): {
    cellsWidth: number;
    cellsHeight: number;
  } {
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
      } = this.drawingSize();
      return {
        cellsWidth:
          width ??
          Math.floor(
            (this.drawing.width - (leftPadding + rightPadding + this.wallSize * 2)) / groupWidth,
          ) * horizontalCellsPerGroup,
        cellsHeight:
          height ??
          Math.floor(
            (this.drawing.height - (topPadding + bottomPadding + this.wallSize * 2)) / groupHeight,
          ) * verticalCellsPerGroup,
      };
    }

    return {
      cellsWidth: width ?? 25,
      cellsHeight: height ?? 25,
    };
  }

  public clear(color?: string): void {
    if (this.drawing) {
      const {
        groupHeight,
        groupWidth,
        horizontalCellsPerGroup = 1,
        verticalCellsPerGroup = 1,
        topPadding = 0,
        leftPadding = 0,
        bottomPadding = 0,
        rightPadding = 0,
      } = this.drawingSize();

      const actualWidth = (this.width / horizontalCellsPerGroup) * groupWidth;
      const actualHeight = (this.height / verticalCellsPerGroup) * groupHeight;
      const availableWidth = this.drawing.width - (leftPadding + rightPadding + this.wallSize * 2);
      const availableHeight =
        this.drawing.height - (topPadding + bottomPadding + this.wallSize * 2);

      const leftOffset = leftPadding + this.wallSize + (availableWidth - actualWidth) / 2;
      const topOffset = topPadding + this.wallSize + (availableHeight - actualHeight) / 2;

      this.drawing.clear(color, leftOffset, topOffset);
    }
  }

  public draw(): void {
    if (this.drawing) {
      this.clear();

      for (const cell of this.all()) {
        if (this.entrance.x === cell.x && this.entrance.y === cell.y) {
          this.drawCell(cell, 'green');
        } else if (this.exit.x === cell.x && this.exit.y === cell.y) {
          this.drawCell(cell, 'red');
        } else {
          this.drawCell(cell);
        }

        for (const outside of this.adjacent(cell).filter((c) => !this.inMaze(c))) {
          const { direction } = outside;

          if (this.walls[cell.x][cell.y][direction]) {
            this.drawWall({ ...outside, direction: this.opposite(direction) });
          }

          for (const pillar of this.pillars) {
            if (pillar.includes(this.opposite(direction))) {
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
      for (let x = 0; x < this.width; ++x) {
        for (let y = 0; y < this.height; ++y) {
          if (this.mask[x][y]) {
            this.drawFloor({ x, y }, this.maskColor);
          }
        }
      }
    }
  }

  public drawDistances(point = this.entrance): void {
    if (this.drawing) {
      const { maxDistance } = this.computeDistances(point);

      for (const cell of this.all()) {
        if (this.entrance.x === cell.x && this.entrance.y === cell.y) {
          this.drawCell(cell, 'green');
        } else if (this.exit.x === cell.x && this.exit.y === cell.y) {
          this.drawCell(cell, 'red');
        } else {
          const color =
            this.distances[cell.x][cell.y] === Infinity ?
              'black'
              //  : `hsla(${(this.distances[x][y] * 360) / maxDistance}, 100%, 50%, 0.25)`;
              //: `rgba(255, 255, 255, ${(1 - this.distances[x][y] / maxDistance) * 0.5})`;
            : `hsla(270, 100%, ${15 + 35 * (1 - this.distances[cell.x][cell.y] / maxDistance)}%)`;

          this.drawCell(cell, color);
        }
      }

      this.drawMasks();
    }
  }

  protected abstract drawingSize(): DrawingSizes;
  //#endregion
  //#region Cell
  public sides(cell: Cell): number {
    return this.sidesMatrix[this.cellKind(cell)];
  }

  public wallCount(cell: Cell, { walls = this.walls }: Overrides = {}): number {
    return Object.values(walls[cell.x][cell.y]).reduce((p, v) => p + (v ? 1 : 0), 0);
  }

  public isDeadEnd(cell: Cell, { walls = this.walls }: Overrides = {}): boolean {
    return (
      this.wallCount(cell, { walls }) === this.sides(cell) - 1 &&
      (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
      (cell.x !== this.exit.x || cell.y !== this.exit.y)
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
        walls[cell2.x][cell2.y][this.opposite(direction)] = true;
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
        walls[cell2.x][cell2.y][this.opposite(direction)] = false;
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

      return { x: cell.x + move.x, y: cell.y + move.y, direction };
    }
    return null;
  }

  public adjacent(cell: Cell): CellDirection[] {
    return this.directions.map((direction) => this.move(cell, direction)).filter((c) => c != null);
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
  public drawCell(
    cell: Cell,
    cellColor = this.cellColor,
    wallColor = this.wallColor,
    { walls = this.walls }: Overrides = {},
  ): void {
    this.drawFloor(
      cell,
      cell.x === this.entrance.x && cell.y === this.entrance.y ? this.entranceColor
      : cell.x === this.exit.x && cell.y === this.exit.y ? this.exitColor
      : cellColor,
    );

    const wall = walls[cell.x][cell.y];
    for (const direction of this.directions) {
      if (wall[direction]) {
        this.drawWall({ ...cell, direction }, wallColor);
      }
    }

    for (const pillar of this.pillars) {
      if (pillar[0] in wall && pillar[1] in wall) {
        this.drawPillar({ ...cell, pillar }, this.wallColor);
      }
    }
  }

  public drawText(cell: Cell, text: string, color = 'black'): void {
    if (this.drawing) {
      this.drawing.text(this.getRect(cell), text, color);
    }
  }

  public drawPath(cell: CellDirection, color = 'cyan'): void {
    if (this.drawing) {
      const rect = this.getRect(cell);

      if (rect.w > rect.h) {
        rect.x += (rect.w - rect.h) / 2;
        rect.w = rect.h;
      } else if (rect.h > rect.w) {
        rect.y += (rect.h - rect.w) / 2;
        rect.h = rect.w;
      }

      if (cell.direction === '?') {
        this.drawing.circle(
          { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 },
          Math.abs(rect.w) / 4,
          color,
        );
      } else {
        const angle = this.pathMatrix[cell.direction];

        const coords: XY[] = [
          { x: 1, y: 0 },
          { x: -1, y: 2 / 3 },
          { x: 0, y: 0 },
          { x: -1, y: -2 / 3 },
        ];

        if (rect.w > rect.h) {
          rect.x += (rect.w - rect.h) / 2;
          rect.w = rect.h;
        } else if (rect.h > rect.w) {
          rect.y += (rect.h - rect.w) / 2;
          rect.h = rect.w;
        }

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
  }

  public drawCircle(cell: Cell, color = 'cyan'): void {
    if (this.drawing) {
      const rect = this.getRect(cell);

      if (rect.w > rect.h) {
        rect.x += (rect.w - rect.h) / 2;
        rect.w = rect.h;
      } else if (rect.h > rect.w) {
        rect.y += (rect.h - rect.w) / 2;
        rect.h = rect.w;
      }

      this.drawing.circle(
        { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 },
        Math.abs(rect.w) / 4,
        color,
      );
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
    switch (p) {
      case 'top left': {
        for (let y = 0; y < this.height; ++y) {
          for (let x = 0; x < this.width; ++x) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }
      // case 'top middle': {
      //   x = Math.floor(this.width / 2);
      //   y = 0;
      //   break;
      // }
      case 'top right': {
        for (let y = 0; y < this.height; ++y) {
          for (let x = this.width - 1; x >= 0; --x) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }
      // case 'middle right': {
      //   x = this.width - 1;
      //   y = Math.floor(this.height / 2);
      //   break;
      // }
      case 'bottom right': {
        for (let y = this.height - 1; y >= 0; --y) {
          for (let x = this.width - 1; x >= 0; --x) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }
      // case 'bottom middle': {
      //   x = Math.floor(this.width / 2);
      //   y = this.height - 1;
      //   break;
      // }
      case 'bottom left': {
        for (let y = this.height - 1; y >= 0; --y) {
          for (let x = 0; x < this.width; ++x) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }

      case 'right top': {
        for (let x = this.width - 1; x >= 0; --x) {
          for (let y = 0; y < this.height; ++y) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }

      case 'right bottom': {
        for (let x = this.width - 1; x >= 0; --x) {
          for (let y = this.height - 1; y >= 0; --y) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }

      case 'left top': {
        for (let x = 0; x < this.width; ++x) {
          for (let y = 0; y < this.height; ++y) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }

      case 'left bottom': {
        for (let x = 0; x < this.width; ++x) {
          for (let y = this.height - 1; y >= 0; --y) {
            if (this.inMaze({ x, y })) {
              return { x, y };
            }
          }
        }
        break;
      }

      // case 'middle left': {
      //   x = 0;
      //   y = Math.floor(this.height / 2);
      //   break;
      // }
      // case 'middle': {
      //   x = Math.floor(this.width / 2);
      //   y = Math.floor(this.height / 2);
      //   break;
      // }
      case 'random':
      default: {
        return this.randomCell();
      }
    }

    throw new Error(`No cell found for location "${p}"`);
  }

  private parseSpecification(pd: Cell | Location): Cell {
    if (typeof pd === 'string') {
      return this.parseLocation(pd);
    }

    return pd;
  }
  //#endregion
}

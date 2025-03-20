import {
  create2DArray,
  modulo,
  randomPick,
  randomShuffle,
  toCartesian,
  toPolar,
} from '@technobuddha/library';

import { animate } from '../drawing/animate.js';
import { type Drawing, type Rect } from '../drawing/drawing.js';
import { parsePointDirection } from '../util/specs.js';

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
  | 'top middle'
  | 'top right'
  | 'bottom left'
  | 'bottom middle'
  | 'bottom right'
  | 'middle left'
  | 'middle'
  | 'middle right'
  | 'random';

export type CDSpecification = CellDirection | Cell | Location;

export type Overrides = { walls?: Wall[][] };

export type MazeProperties = {
  drawing?: Drawing;
  width?: number;
  height?: number;
  cellSize?: number;
  cellColor?: string;
  wallSize?: number;
  wallColor?: string;
  entrance?: CDSpecification;
  exit?: CDSpecification;
  random?(this: void): number;
};

export type Wall = Record<Direction, boolean | undefined>;

export abstract class Maze {
  public readonly width: NonNullable<MazeProperties['width']>;
  public readonly height: NonNullable<MazeProperties['height']>;
  public readonly cellSize: NonNullable<MazeProperties['cellSize']>;
  public readonly cellColor: NonNullable<MazeProperties['cellColor']>;
  public readonly wallSize: NonNullable<MazeProperties['wallSize']>;
  public readonly wallColor: NonNullable<MazeProperties['wallColor']>;
  public entrance: Terminus = { x: 0, y: 0, direction: '?' };
  public exit: Terminus = { x: 0, y: 0, direction: '?' };

  protected readonly directions: Direction[];
  protected readonly pillars: Pillar[];
  protected readonly walls: Wall[][];
  protected readonly distances: number[][];
  protected readonly mask: boolean[][];
  protected readonly random: MazeProperties['random'];
  protected drawing: MazeProperties['drawing'];

  private readonly wallMatrix: Record<Kind, Record<Direction, boolean>>;
  private readonly oppositeMatrix: Record<Direction, Direction>;
  private readonly rightTurnMatrix: Record<Direction, Direction[]>;
  private readonly leftTurnMatrix: Record<Direction, Direction[]>;
  private readonly moveMatrix: Record<Kind, Record<Direction, XY | XY[]>>;
  private readonly sidesMatrix: Record<Kind, number>;
  private readonly edgesMatrix: Record<Kind, Direction[]>;
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
      entrance,
      exit,
      random = Math.random,
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
  ) {
    this.wallMatrix = wallMatrix;
    this.oppositeMatrix = oppositeMatrix;
    this.rightTurnMatrix = rightTurnMatrix;
    this.leftTurnMatrix = leftTurnMatrix;
    this.moveMatrix = moveMatrix;
    this.sidesMatrix = sidesMatrix;
    this.edgesMatrix = edgesMatrix;

    this.directions = directions;
    this.pillars = pillars;
    this.drawing = drawing;
    this.cellSize = cellSize;
    this.cellColor = cellColor;
    this.wallSize = wallSize;
    this.wallColor = wallColor;
    this.width = width ?? this.computeWidth(drawing?.width) ?? 25;
    this.height = height ?? this.computeHeight(drawing?.height) ?? 25;
    this.random = random;
    this.entranceSpec = entrance;
    this.exitSpec = exit;

    this.walls = create2DArray(this.width, this.height, (x, y) => this.initialWalls({ x, y }));
    this.mask = create2DArray(this.width, this.height, false);
    this.distances = create2DArray(this.width, this.height, Infinity);
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

  public resolveDirection(spec: CDSpecification): CellDirection {
    const cell = parsePointDirection(spec, this.width, this.height);

    if ('direction' in cell) {
      return cell;
    }

    const adjacent = this.adjacent(cell);
    const outside = adjacent.filter((c) => !this.inMaze(c));
    if (outside.length > 0) {
      return { ...cell, direction: this.randomPick(outside)!.direction };
    }

    return { ...cell, direction: this.randomPick(adjacent)!.direction };
  }
  //#endregion
  //#region Maze
  public all(): Cell[] {
    return create2DArray(this.width, this.height, (x, y) => ({ x, y })).flat();
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

  protected computeDistances(point: Cell = this.entrance): { maxDistance: number; maxCell: Cell } {
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
      const distance = this.distances[cell.x][cell.y] + 1;

      const neighbors = this.randomShuffle(
        this.validMoves(cell).filter((n) => this.distances[n.x][n.y] === Infinity),
      );

      for (const neighbor of neighbors) {
        this.distances[neighbor.x][neighbor.y] = distance;

        if (distance > maxDistance) {
          maxCell = cell;
          maxDistance = distance;
        }

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

  public termini(): this {
    const entrance = this.entranceSpec;
    const exit = this.exitSpec;

    if (entrance && exit) {
      this.entrance = this.resolveDirection(entrance);
      this.exit = this.resolveDirection(exit);

      this.walls[this.entrance.x][this.entrance.y][this.entrance.direction] = false;
      this.walls[this.exit.x][this.exit.y][this.exit.direction] = false;
    } else {
      const begin = this.computeDistances({ x: 0, y: 0 }).maxCell;
      const finish = this.computeDistances(begin).maxCell;

      this.entrance = {
        ...begin,
        direction: this.randomPick(Object.keys(this.walls[begin.x][begin.y]))!,
      };
      this.exit = {
        ...finish,
        direction: this.randomPick(Object.keys(this.walls[finish.x][finish.y]))!,
      };
    }

    return this;
  }
  //#endregion
  //#region Maze Drawing
  public prepareDrawing(drawing?: Drawing): void {
    this.drawing = drawing;
    this.clear();
  }

  protected computeWidth(width?: number): number | undefined {
    if (width) {
      const [cell, padding] = this.drawingWidth();
      return Math.floor((width - (padding + 2 * this.wallSize)) / cell);
    }
    return undefined;
  }

  protected computeHeight(height?: number): number | undefined {
    if (height) {
      const [cell, padding] = this.drawingHeight();
      return Math.floor((height - (padding + 2 * this.wallSize)) / cell);
    }
    return undefined;
  }

  public clear(color?: string): void {
    if (this.drawing) {
      const [, wMargin] = this.drawingWidth();
      const [, hMargin] = this.drawingHeight();

      this.drawing.clear(color, wMargin / 2 + this.wallSize, hMargin / 2 + this.wallSize);
    }
  }

  public draw(): void {
    if (this.drawing) {
      this.clear();

      for (let x = 0; x < this.width; ++x) {
        for (let y = 0; y < this.height; ++y) {
          this.drawCell({ x, y });
        }
      }

      const x0 = 0;
      const y0 = 0;
      const x1 = this.width - 1;
      const y1 = this.height - 1;
      const edges: Cell[] = [];
      for (let x = 0; x < this.width; ++x) {
        edges.push({ x, y: y0 }, { x, y: y1 });
      }
      for (let y = 0; y < this.height; ++y) {
        edges.push({ x: x0, y }, { x: x1, y });
      }

      for (const edge of edges) {
        for (const outside of this.adjacent(edge).filter((cell) => !this.inMaze(cell))) {
          const { direction } = outside;

          if (this.walls[edge.x][edge.y][direction]) {
            this.drawWall({ ...outside, direction: this.opposite(direction) });
          }

          for (const pillar of this.pillars) {
            if (pillar.includes(this.opposite(direction))) {
              this.drawPillar({ ...outside, pillar });
            }
          }
        }
      }
    }
  }

  public drawDistances(point = this.entrance): void {
    if (this.drawing) {
      const { maxDistance } = this.computeDistances(point);

      for (let x = 0; x < this.width; ++x) {
        for (let y = 0; y < this.height; ++y) {
          const color =
            this.distances[x][y] === Infinity ?
              'black'
              //  : `hsla(${(this.distances[x][y] * 360) / maxDistance}, 100%, 50%, 0.25)`;
              //: `rgba(255, 255, 255, ${(1 - this.distances[x][y] / maxDistance) * 0.5})`;
            : `hsla(270, 100%, ${15 + 35 * (1 - this.distances[x][y] / maxDistance)}%)`;

          this.drawCell({ x, y }, color);
        }
      }
    }
  }

  protected abstract drawingWidth(): [cell: number, padding: number];
  protected abstract drawingHeight(): [cell: number, padding: number];
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
    this.drawFloor(cell, cellColor);

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

  protected drawArrow(rect: Rect, angle: number, color = 'cyan'): void {
    const r = rect;

    if (this.drawing) {
      const coords: XY[] = [
        { x: 1, y: 0 },
        { x: -1, y: 2 / 3 },
        { x: 0, y: 0 },
        { x: -1, y: -2 / 3 },
      ];

      if (r.w > r.h) {
        r.x += (r.w - r.h) / 2;
        r.w = r.h;
      } else if (r.h > r.w) {
        r.y += (r.h - r.w) / 2;
        r.h = r.w;
      }

      // scale
      for (const c of coords) {
        c.x = (c.x * r.w) / 2;
        c.y = (c.y * r.h) / 2;
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
        coords.map((c) => ({ x: r.x + r.w / 2 + c.x, y: r.y + r.h / 2 - c.y })),
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
  public abstract drawPath(cell: CellDirection, color?: string): void;
  public abstract drawX(cell: Cell, color?: string): void;
  public abstract getRect(cell: Cell): Rect;
  //#endregion
}

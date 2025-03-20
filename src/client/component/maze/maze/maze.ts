import { create2DArray, randomPick, toCartesian, toPolar } from '@technobuddha/library';

import { type Drawing, type Rect } from '../drawing/drawing.js';
import { animate } from '../util/animate.js';
import { parsePointDirection } from '../util/specs.js';

export type Direction = string;
export type Corner = `${Direction}${Direction}`;

export type Kind = number;

export type XY = { x: number; y: number };

export type Cell = {
  x: number;
  y: number;
};

export type CellDirection = Cell & {
  direction: Direction;
};

export type CellCorner = Cell & {
  corner: Corner;
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
  public readonly directions: Direction[] = [];
  public readonly corners: Corner[] = [];
  public readonly walls: Wall[][];

  public readonly width: NonNullable<MazeProperties['width']>;
  public readonly height: NonNullable<MazeProperties['height']>;
  public readonly cellSize: NonNullable<MazeProperties['cellSize']>;
  public readonly cellColor: NonNullable<MazeProperties['cellColor']>;
  public readonly wallSize: NonNullable<MazeProperties['wallSize']>;
  public readonly wallColor: NonNullable<MazeProperties['wallColor']>;
  public entrance: CellDirection;
  public exit: CellDirection;

  protected readonly random: MazeProperties['random'];
  protected drawing: MazeProperties['drawing'];

  public constructor(
    {
      drawing,
      width,
      height,
      cellSize = 21,
      cellColor = 'black',
      wallSize = 1,
      wallColor = 'white',
      entrance = 'top left',
      exit = 'bottom right',
      random = Math.random,
    }: MazeProperties,
    directions: Direction[],
    corners: Corner[],
  ) {
    this.directions = directions;
    this.corners = corners;
    this.drawing = drawing;
    this.cellSize = cellSize;
    this.cellColor = cellColor;
    this.wallSize = wallSize;
    this.wallColor = wallColor;
    this.width = width ?? this.computeWidth(drawing?.width) ?? 25;
    this.height = height ?? this.computeHeight(drawing?.height) ?? 25;
    this.entrance = this.resolveDirection(entrance);
    this.exit = this.resolveDirection(exit);
    this.random = random;

    this.walls = create2DArray(this.width, this.height, (x, y) => this.initialWalls(x, y));
    this.walls[this.entrance.x][this.entrance.y][this.entrance.direction] = false;
    this.walls[this.exit.x][this.exit.y][this.exit.direction] = false;
  }

  protected randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
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

  public draw(): void {
    if (this.drawing) {
      this.clear();

      for (let x = 0; x < this.width; ++x) {
        for (let y = 0; y < this.height; ++y) {
          this.drawCell({ x, y });

          // const wall = this.walls[x][y];
          // for (const direction of this.directions) {
          //   if (wall[direction]) {
          //     this.drawWall({ x, y, direction });
          //   }
          // }

          // for (const corner of this.corners) {
          //   if (corner[0] in wall && corner[1] in wall) {
          //     this.drawPillar({ x, y, corner });
          //   }
          // }
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

          for (const corner of this.corners) {
            if (corner.includes(this.opposite(direction))) {
              this.drawPillar({ ...outside, corner });
            }
          }
        }
      }
    }
  }

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

    for (const corner of this.corners) {
      if (corner[0] in wall && corner[1] in wall) {
        this.drawPillar({ ...cell, corner }, this.wallColor);
      }
    }
  }

  public drawArrow(rect: Rect, angle: number, color = 'cyan'): void {
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

  public all(): Cell[] {
    return create2DArray(this.width, this.height, (x, y) => ({ x, y })).flat();
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

  public sides(cell: Cell, { walls = this.walls }: Overrides = {}): number {
    return Object.values(walls[cell.x][cell.y]).reduce((p, v) => p + (v ? 1 : 0), 0);
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

  public inMaze(cell: Cell): boolean {
    return cell.x >= 0 && cell.x < this.width && cell.y >= 0 && cell.y < this.height;
  }

  public scan(cell: Cell): Cell {
    let { x, y } = cell;

    x++;
    if (x >= this.width) {
      x = 0;
      y++;
    }

    return { x, y };
  }

  public prepareContext(context?: Drawing): void {
    this.drawing = context;
    this.clear();
  }

  public clear(color?: string): void {
    const [, wMargin] = this.drawingWidth();
    const [, hMargin] = this.drawingHeight();

    this.drawing?.clear(color, wMargin / 2 + this.wallSize, hMargin / 2 + this.wallSize);
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

  public removeInteriorWalls(): void {
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        for (const neighbor of this.neighbors({ x, y })) {
          this.removeWall({ x, y }, neighbor.direction);
        }
      }
    }
  }

  public addWall(cell: Cell, direction: Direction, { walls = this.walls }: Overrides = {}): void {
    if (this.inMaze(cell)) {
      walls[cell.x][cell.y][direction] = true;
      this.drawCell(cell, this.cellColor, this.wallColor, { walls });

      const cell2 = this.move(cell, direction);
      if (cell2 && this.inMaze(cell2)) {
        walls[cell2.x][cell2.y][this.opposite(direction)] = true;
        this.drawCell(cell2, this.cellColor, this.wallColor, { walls });
      }
    }
  }

  public cloneWalls(): Wall[][] {
    return this.walls.map((row) => [...row]);
  }

  public drawText(cell: Cell, text: string, color = 'black'): void {
    if (this.drawing) {
      this.drawing.text(this.getRect(cell), text, color);
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

  //public abstract toString(): string;
  // protected distancesFrom(point = this.entrance) {
  //     const queue: Cell[]    = [];
  //     const distances         = create2DArray(this.width, this.height, Infinity);
  //     distances[point.x][point.y]  = 0;
  //     queue.unshift(point);

  //     let maxDistance = 1;
  //     while(queue.length) {
  //         const cell      = queue.pop()!;
  //         const neighbors = randomShuffle(
  //             this.neighbors(cell)
  //             .filter(n => !this.walls[cell.x][cell.y][n.direction] && distances[n.x][n.y] === Infinity)
  //         );

  //         for(const neighbor of neighbors) {
  //             const distance = distances[cell.x][cell.y] + 1;
  //             distances[neighbor.x][neighbor.y]  = distance;

  //             if(distance > maxDistance)
  //                 maxDistance = distance;

  //             queue.unshift(neighbor);
  //         }
  //     }

  //     return { distances, maxDistance };
  // }

  // public drawDistances(point = this.entrance) {
  //     if(this.context) {
  //         const { distances, maxDistance } = this.distancesFrom(point);

  //         for(let x = 0; x < this.width; ++x) {
  //             for(let y = 0; y < this.height; ++y) {
  //                 if(distances[x][y] === Infinity) {
  //                     this.context.fillStyle = 'black';
  //                 } else {
  //                     this.context.fillStyle = //`hsla(${distances[x][y] * 360 / maxDistance}, 100%, 50%, 0.25)`;
  //                     `rgba(0, 0, 0, ${distances[x][y] * 0.5 / maxDistance})`;
  //                 }

  //                 this.context.fillRect(
  //                     x * this.cellSize + this.wallSize,
  //                     y * this.cellSize + this.wallSize,
  //                     this.cellSize - (this.wallSize * 2),
  //                     this.cellSize - (this.wallSize * 2)
  //                 );
  //                 if(!this.walls[x][y].N) {
  //                     this.context.fillRect(
  //                         x * this.cellSize + this.wallSize,
  //                         y * this.cellSize,
  //                         this.cellSize - (this.wallSize * 2),
  //                         this.wallSize,
  //                     );
  //                 }
  //                 if(!this.walls[x][y].S) {
  //                     this.context.fillRect(
  //                         x * this.cellSize + this.wallSize,
  //                         y * this.cellSize + (this.cellSize - this.wallSize),
  //                         this.cellSize - (this.wallSize * 2),
  //                         this.wallSize
  //                     );
  //                 }
  //                 if(!this.walls[x][y].W) {
  //                     this.context.fillRect(
  //                         x * this.cellSize,
  //                         y * this.cellSize + this.wallSize,
  //                         this.wallSize,
  //                         this.cellSize - (this.wallSize * 2)
  //                     );
  //                 }
  //                 if(!this.walls[x][y].E) {
  //                     this.context.fillRect(
  //                         x * this.cellSize + (this.cellSize - this.wallSize),
  //                         y * this.cellSize + this.wallSize,
  //                         this.wallSize,
  //                         this.cellSize - (this.wallSize * 2)
  //                     );
  //                 }
  //             }
  //         }
  //     }
  // }

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

  protected abstract offsets(kind: Kind): Record<string, number>;

  protected abstract drawingWidth(): [cell: number, padding: number];
  protected abstract drawingHeight(): [cell: number, padding: number];
  protected abstract cellKind(cell: Cell): Kind;
  protected abstract initialWalls(x: number, y: number): Wall;

  public abstract opposite(direction: Direction): Direction;
  public abstract rightTurn(direction: Direction): Direction[];
  public abstract leftTurn(direction: Direction): Direction[];
  public abstract move(cell: Cell, direction: Direction): CellDirection | null;
  public abstract isDeadEnd(cell: Cell, overrides?: Overrides): boolean;
  public abstract edges(cell: Cell, overrides?: Overrides): Direction[];

  public abstract drawFloor(cell: Cell, color?: string): void;
  public abstract drawWall(cd: CellDirection, color?: string): void;
  public abstract drawPillar(cell: CellCorner, color?: string): void;
  public abstract drawPath(cell: CellDirection, color?: string): void;
  public abstract drawX(cell: Cell, color?: string, cellColor?: string): void;

  public abstract getRect(cell: Cell): Rect;
}

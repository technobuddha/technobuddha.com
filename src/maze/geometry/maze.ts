import {
  type Cartesian,
  create2dArray,
  lookAhead,
  type Rect,
  rotate,
  scale,
  star,
  toRadians,
  translate,
} from '@technobuddha/library';

import { CanvasDrawing, type Drawing } from '../drawing/index.ts';
import { inverse, logger } from '../library/index.ts';

import { type Bridge } from './bridges.ts';
import { defaultColors, type MazeColors } from './color.ts';
import {
  type Cell,
  type CellDirection,
  type CellFacing,
  type CellTunnel,
  type Direction,
  type Kind,
  type Pillar,
  type Terminus,
} from './geometry.ts';
import { type Matrix } from './matrix.ts';
import { type AllOrder, MazeGeometry, type MazeGeometryProperties } from './maze-geometry.ts';

const starShape = rotate(star(5, 0.5, 1), Math.PI / 10);

type Zone = 'edge' | 'interior';

type Location = `${AllOrder} ${Zone}`;

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

export type ShowDistances = 'none' | 'greyscale' | 'primary' | 'color' | 'spectrum';

type Loop = {
  readonly cell: Cell;
  readonly distance: number;
  readonly loops: Cell[];
  readonly distances: number[];
};

export type MazeProperties = MazeGeometryProperties & {
  readonly drawing?: Drawing;
  readonly cellSize?: number;
  readonly wallSize?: number;
  readonly voidSize?: number;
  readonly entrance?: Cell | CellDirection | Location;
  readonly exit?: Cell | CellDirection | Location;

  readonly showDistances?: ShowDistances;
  readonly color?: Partial<MazeColors>;

  readonly showCoordinates?: boolean;
  readonly showKind?: boolean;
  readonly showBridges?: boolean;
  readonly showUnreachables?: boolean;

  readonly plugin?: (this: void, maze: Maze) => void;
};

export abstract class Maze extends MazeGeometry {
  //#region Properties

  public entrance: Terminus = { x: -1, y: -1, facing: '!' };
  public exit: Terminus = { x: -1, y: -1, facing: '!' };
  public solution: CellTunnel[] = [];

  public actualWidth = 0;
  public actualHeight = 0;
  public leftOffset = 0;
  public topOffset = 0;

  public readonly wallSize: NonNullable<MazeProperties['wallSize']>;
  public readonly cellSize: NonNullable<MazeProperties['cellSize']>;
  public readonly voidSize: NonNullable<MazeProperties['voidSize']>;
  public readonly showDistances: NonNullable<MazeProperties['showDistances']>;
  public readonly showCoordinates: NonNullable<MazeProperties['showCoordinates']>;
  public readonly showKind: NonNullable<MazeProperties['showKind']>;
  public readonly showBridges: NonNullable<MazeProperties['showBridges']>;
  public readonly showUnreachables: boolean;

  private readonly entranceSpec: MazeProperties['entrance'];
  private readonly exitSpec: MazeProperties['exit'];
  protected plugin: MazeProperties['plugin'];
  public drawing: MazeProperties['drawing'];
  public readonly color: NonNullable<Required<MazeColors>>;
  //#endregion

  //#region Construction
  public constructor(
    {
      drawing,
      cellSize = 21,
      wallSize = 1,
      voidSize = 0,
      entrance,
      exit,
      color,
      showDistances = 'none',
      showCoordinates = false,
      showKind = false,
      showBridges = false,
      showUnreachables = false,
      plugin,
      ...props
    }: MazeProperties,
    matrix: Matrix,
  ) {
    super(props, matrix);

    this.cellSize = cellSize;
    this.wallSize = wallSize;
    this.voidSize = voidSize;

    this.drawing = drawing;

    this.color = { ...defaultColors, ...color };

    this.showDistances = showDistances;

    this.showCoordinates = showCoordinates;
    this.showKind = showKind;
    this.showBridges = showBridges;
    this.showUnreachables = showUnreachables;

    this.entranceSpec = entrance;
    this.exitSpec = exit;

    this.plugin = plugin;

    this.reset();
  }

  public reset(): void {
    let width = this.requestedWidth;
    let height = this.requestedHeight;
    let leftOffset: number | undefined = undefined;
    let topOffset: number | undefined = undefined;
    let actualWidth: number | undefined = undefined;
    let actualHeight: number | undefined = undefined;

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

      actualWidth = (width / horizontalCellsPerGroup) * groupWidth + this.wallSize * 2;
      actualHeight = (height / verticalCellsPerGroup) * groupHeight + this.wallSize * 2;

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

    this.actualWidth = actualWidth ?? 0;
    this.actualHeight = actualHeight ?? 0;
    this.leftOffset = leftOffset ?? 0;
    this.topOffset = topOffset ?? 0;

    this.createNexus();

    this.plugin?.(this);
  }

  //#endregion
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

  //#region Maze
  public isDeadEnd(cell: Cell): boolean {
    return (
      !this.isSame(cell, this.entrance) &&
      !this.isSame(cell, this.exit) &&
      this.moves(cell, { wall: false }).length === 1
    );
  }

  public analyze(entrance: Cell = this.entrance): {
    maxDistance: number;
    maxCell: Cell;
    distances: number[][];
    unreachable: Cell[];
    loops: Loop[];
  } {
    const distances = create2dArray(this.width, this.height, Infinity);
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
        .filter(({ target }) => distances[target.x][target.y] !== Infinity)
        .filter(({ target }) => distances[target.x][target.y] !== distance)
        .map(({ target }) => target);
      if (loopCells.length > 0) {
        loops.push({
          cell,
          loops: loopCells,
          distance,
          distances: loopCells.map((l) => distances[l.x][l.y]),
        });
      }

      const moves = this.moves(cell, { wall: false })
        .filter(({ target }) => distances[target.x][target.y] === Infinity)
        .map(({ target }) => target);
      for (const next of moves) {
        distances[next.x][next.y] = distance + 1;
        queue.unshift(next);
      }
    }

    const unreachable = this.cellsInMaze().filter((cell) => distances[cell.x][cell.y] === Infinity);

    return { maxDistance, maxCell, distances, unreachable, loops };
  }

  public solve(entrance: CellFacing = this.entrance, exit: CellFacing = this.exit): CellFacing[] {
    const visited = create2dArray(this.width, this.height, false);
    const parent: (CellFacing | undefined)[][] = create2dArray(this.width, this.height, undefined);
    const queue: CellFacing[] = [entrance];

    visited[entrance.x][entrance.y] = true;

    while (queue.length > 0) {
      const cell = queue.shift()!;

      for (const move of this.moves(cell, { wall: false }).filter(
        ({ target }) => !visited[target.x][target.y],
      )) {
        visited[move.target.x][move.target.y] = true;
        parent[move.target.x][move.target.y] = cell;
        queue.push(move.target);
      }
    }

    const solution: CellFacing[] = [];

    let cell: CellFacing | undefined = exit;
    while (cell) {
      solution.unshift(cell);
      cell = parent[cell.x][cell.y];
    }

    return solution;
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
            this.randomPick(
              this.nexus(entrance)
                .wallDirections()
                .filter((d) => d !== direction),
            )!,
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

    this.drawing = drawing;
    return current;
  }

  protected abstract drawingSize(): DrawingSizes;

  public clear(color: string = this.color.void): void {
    if (this.drawing) {
      this.drawing.clear(color, {
        originX: this.leftOffset,
        originY: this.topOffset,
      });
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
        this.eraseCell(cell, this.color.void);
      }
    }
  }

  public detectErrors(): void {
    const { unreachable } = this.analyze(this.entrance);

    if (unreachable.length > 0) {
      this.sendMessage(`There are ${unreachable.length} unreachable cells`, { level: 'error' });
      logger.error(`Unreachable cells: `, unreachable);

      if (this.showUnreachables) {
        for (const cell of unreachable) {
          this.drawCell(cell, this.color.error);
        }
      }
    }

    // if (loops.length > 0) {
    //   for (const loop of loops) {
    //     logger.error(
    //       `Loop detected from {x: ${loop.cell.x}, y: ${loop.cell.y} :: ${loop.distance}} with ${loop.loops.map((l, i) => `{x: ${l.x}, y:${l.y} :: ${loop.distances[i]}}`).join(' ')}`,
    //     );

    //     this.drawX(loop.cell, this.color.error);
    //   }
    // }

    // if (loops.length > 0 || unreachable.length > 0) {
    //   // eslint-disable-next-line no-debugger
    //   debugger;
    // }
  }

  public drawDistances(method = this.showDistances, point = this.entrance): void {
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
            color = this.color.error;
          } else {
            const grey = (1 - distance / maxDistance) * 0.35 + 0.15;

            switch (method) {
              case 'none': {
                color = this.color.cell;
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

  public drawSolution(color = this.color.solution, method = this.showDistances): void {
    if (this.drawing) {
      this.drawDistances(method);
      this.drawPaths(this.solution, color);
      this.drawCell(this.exit);
      this.drawPath({ ...this.exit, direction: this.opposite(this.exit.facing) }, color);
    }
  }
  //#endregion
  //#region Cell

  protected abstract cellOrigin(cell: Cell): Cartesian;

  protected cellOffsets(cell: Cell): Record<string, number> {
    const { x, y } = this.cellOrigin(cell);

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
  //#region Path
  public makePath(history: CellFacing[]): CellTunnel[] {
    const path: CellTunnel[] = [];

    if (history.length > 0) {
      for (const [cell, next] of lookAhead(this.flatten(history))) {
        const walk = this.walkTo(cell, next);
        if (walk) {
          const { direction, tunnel } = walk;

          path.push({ x: cell.x, y: cell.y, direction, tunnel: false });
          if (tunnel) {
            for (const [tunnelCell, tunnelNext] of lookAhead(tunnel, { last: next })) {
              const traverse = this.traverseTo(tunnelCell, tunnelNext);
              path.push({
                x: tunnelCell.x,
                y: tunnelCell.y,
                direction: traverse.direction,
                tunnel: true,
              });
            }
          }
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
    const cell2 = this.move(cell, direction);
    if (this.inMaze(cell) && this.inMaze(cell2)) {
      this.nexus(cell).addWall(direction);

      const direction2 = this.opposite(cell2.facing);
      this.nexus(cell2).addWall(direction2);

      if (draw) {
        this.drawCell(cell);
        this.drawCell(cell2);
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
  //#region Cell Kind
  public cellZone(_cell: Cell): number {
    return 0;
  }
  //#endregion
  //#region Cell Drawing
  protected cellColor(cell: Cell, color: string): string {
    if (this.isSame(cell, this.entrance)) {
      return this.color.entrance;
    }

    if (this.isSame(cell, this.exit)) {
      return this.color.exit;
    }

    if (color === this.color.cell && this.nexus(cell).elevated) {
      return this.color.bridge;
    }

    return color;
  }

  public drawCell<T extends Cell>(
    cell: T,
    cellColor = this.color.cell,
    wallColor = this.color.wall,
  ): T {
    this.eraseCell(cell);
    this.drawFloor(cell, this.cellColor(cell, cellColor));

    this.drawWalls(cell, wallColor);
    this.drawPillars(cell, wallColor);

    if (this.showCoordinates) {
      this.drawText(cell, cell.x === 0 ? cell.y.toString() : cell.x.toString());
    } else if (this.showKind) {
      this.drawText(cell, this.cellKind(cell).toString());
    } else if (this.showBridges && this.nexus(cell).bridge) {
      this.drawText(cell, '○');
    }

    return cell;
  }

  public drawWalls(cell: Cell, wallColor = this.color.wall, cellColor = this.color.cell): void {
    const nexus = this.nexus(cell);
    const { walls, barriers, elevated } = nexus;

    for (const direction of this.directions) {
      if (walls[direction] === true || barriers[direction]) {
        this.drawWall(cell, direction, wallColor);
      } else if (walls[direction] === false) {
        const move = this.traverse(cell, direction);
        if (
          this.inMaze(move) &&
          this.nexus(move).tunnels[this.opposite(move.facing)] &&
          this.nexus(move).walls[this.opposite(move.facing)] === true
        ) {
          this.drawTunnel(cell, direction);
        } else if (elevated) {
          this.drawWall(cell, direction, this.color.bridge);
          this.drawPassage(cell, direction, this.color.wall, this.color.bridge);
        } else {
          this.drawPassage(cell, direction, wallColor, cellColor);
        }
      }
    }
  }

  public drawPillars(cell: Cell, color = this.color.wall): void {
    const { walls } = this.nexus(cell);

    for (const pillar of this.pillars) {
      if (pillar[0] in walls && pillar[1] in walls) {
        this.drawPillar(cell, pillar, color);
      }
    }
  }

  public drawText(cell: Cell, text: string, color = this.color.text): void {
    if (this.drawing) {
      const { rect } = this.nexus(cell);

      this.drawing.text(rect, text, color);
    }
  }

  public drawTunnel(
    cell: Cell,
    direction: Direction,
    wallColor = this.color.wall,
    tunnelColor = this.color.tunnel,
  ): void {
    this.drawPassage(cell, direction, wallColor, tunnelColor);
  }

  public abstract drawPassage(
    cell: Cell,
    direction: Direction,
    wallColor: string,
    cellColor: string,
  ): void;

  public drawPath(cell: CellDirection, color = this.color.path): void {
    if (this.drawing) {
      const { rect } = this.nexus(cell);
      if (cell.direction === '?') {
        this.renderCircle(rect, color);
      } else {
        const angle = this.angleMatrix[cell.direction] ?? 0;

        this.renderArrow(rect, angle, color);
      }
    }
  }

  public drawPaths(cells: CellTunnel[], color = this.color.path): void {
    if (this.drawing) {
      for (const cell of cells) {
        this.drawPath(cell, cell.tunnel ? inverse(color) : color);
      }
    }
  }

  public drawStar(cell: Cell, color = this.color.avatar): void {
    if (this.drawing) {
      const { rect } = this.nexus(cell);
      this.drawCell(cell);
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

  protected renderShape(coords: Cartesian[], rect: Rect, angle: number, color: string): void {
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

  public drawAvatar(cell: Cell, color = this.color.avatar): void {
    if (this.drawing) {
      const { rect } = this.nexus(cell);

      this.renderCircle(rect, color);
    }
  }

  public drawDot(cell: Cell, color = this.color.avatar, r = 0.125): void {
    if (this.drawing) {
      const { rect } = this.nexus(cell);
      this.renderCircle(rect, color, r);
    }
  }

  protected renderCircle(rect: Rect, color: string, r = 0.25): void {
    if (this.drawing) {
      this.drawing.circle(
        { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
        Math.abs(rect.width) * r,
        color,
      );
    }
  }

  protected abstract offsets(kind: Kind): Record<string, number>;

  public abstract eraseCell(cell: Cell, color?: string): void;
  public abstract drawFloor(cell: Cell, color?: string): void;
  public abstract drawWall(cell: Cell, direction: Direction, color?: string): void;
  public abstract drawPillar(cell: Cell, pillar: Pillar, color?: string): void;
  public abstract drawX(cell: Cell, color?: string): void;
  //#endregion
  //#region Location
  public parseLocation(p: Location): Cell {
    const [allOrder, zone] = p.split(' ') as [AllOrder, Zone];

    const cells = this.cellsInMaze(allOrder);

    let cell: Cell | undefined = undefined;
    switch (zone) {
      case 'edge': {
        cell = cells.find((cell) => this.moves(cell, { wall: 'all', inMaze: false }).length > 0);
        break;
      }

      case 'interior': {
        cell = cells.find((cell) => this.moves(cell, { wall: 'all', inMaze: false }).length === 0);
        break;
      }

      // no default
    }

    if (cell) {
      return cell;
    }

    this.sendMessage(`Unable to find cell matching criteria "${p}"`, { level: 'warning' });
    return this.randomCell();
  }

  private parseSpecification(pd: Cell | Location): Cell {
    if (typeof pd === 'string') {
      return this.parseLocation(pd);
    }

    return pd;
  }
  //#endregion
  //#region Bridge
  public bridges(cell: Cell): Bridge[] {
    const pieces = this.bridgeMatrix?.pieces ?? 1;
    const connect = this.bridgeMatrix?.connect ?? {};
    return (this.bridgeMatrix?.layouts[this.cellKind(cell)] ?? []).map((layout) => ({
      direction: layout.path[0],
      pieces,
      connect,
      ...layout,
    }));
  }
  //#endregion
  //#region Export
  public export({
    canvas = document.createElement('canvas'),
    showSolution = false,
    transparentBackground = false,
    showDistances = this.showDistances,
    scale = 1,
  }: {
    canvas: HTMLCanvasElement;
    showSolution?: boolean;
    transparentBackground?: boolean;
    showDistances?: ShowDistances;
    scale?: number;
  }): void {
    if (this.drawing) {
      const draw = this.attachDrawing(new CanvasDrawing(canvas, { scale }));

      const bg = this.color.void;
      if (transparentBackground) {
        this.color.void = 'transparent';
      }

      if (showSolution) {
        this.clear();
        this.drawSolution(this.color.solution, showDistances);
      } else {
        this.draw();
        this.drawDistances(showDistances);
      }

      if (transparentBackground) {
        this.color.void = bg;
      }

      this.attachDrawing(draw);
    }
  }
}

import create2DArray from '@technobuddha/library/create2DArray';
import randomPick    from '@technobuddha/library/randomPick';
import { parsePointDirection } from '../util/specs';

const MARGIN = 2;

export type Direction = string;
export type Corner   = string;

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

type Location  = 'top left' | 'top middle' | 'top right' |
'bottom left' | 'bottom middle' | 'bottom right' |
'middle left' | 'middle' | 'middle right' |
'random';

export type CSpecification  = Cell | Location;
export type CDSpecification = CellDirection | Cell | Location;

export type MazeProperties = {
    context?:               CanvasRenderingContext2D;
    width?:                 number;
    height?:                number;
    cellSize?:              number;
    cellColor?:             string;
    wallSize?:              number;
    wallColor?:             string;
    entrance?:              CDSpecification;
    exit?:                  CDSpecification;
};

export type Wall = Record<Direction, boolean | undefined>;
export abstract class Maze {
    public directions:              Direction[] = [];
    public corners:                 Corner[]    = [];
    public walls:                   Wall[][];
    public context:                 MazeProperties['context'];
    public width:                   Exclude<MazeProperties['width'],     undefined>;
    public height:                  Exclude<MazeProperties['height'],    undefined>;
    public readonly cellSize:       Exclude<MazeProperties['cellSize'],  undefined>;
    public readonly cellColor:      Exclude<MazeProperties['cellColor'], undefined>;
    public readonly wallSize:       Exclude<MazeProperties['wallSize'],  undefined>;
    public readonly wallColor:      Exclude<MazeProperties['wallColor'], undefined>;
    public entrance:                CellDirection;
    public exit:                    CellDirection;

    constructor(
        {
            context,
            width,
            height,
            cellSize    = 21,
            cellColor   = 'black',
            wallSize    = 1,
            wallColor   = 'white',
            entrance    = 'top left',
            exit        = 'bottom right',
        }:  MazeProperties,
        directions: Direction[],
        corners:    Corner[]
    ) {
        this.directions         = directions;
        this.corners            = corners;
        this.context            = context;
        this.cellSize           = cellSize;
        this.cellColor          = cellColor;
        this.wallSize           = wallSize;
        this.wallColor          = wallColor;
        this.width              = width   ?? this.computeWidth(context?.canvas?.width)   ?? 25;
        this.height             = height  ?? this.computeHeight(context?.canvas?.height) ?? 25;
        this.entrance           = this.resolveDirection(entrance);
        this.exit               = this.resolveDirection(exit);

        this.walls = create2DArray(this.width, this.height, (x, y) => this.initialWalls(x, y));
        this.walls[this.entrance.x][this.entrance.y][this.entrance.direction] = false;
        this.walls[this.exit.x][this.exit.y][this.exit.direction]             = false;
    }

    private resolveDirection(spec: CDSpecification): CellDirection {
        const cell = parsePointDirection(spec, this.width, this.height);

        if('direction' in cell)
            return cell;

        const adjacent = this.adjacent(cell);
        const outside  = adjacent.filter(c => !this.inMaze(c));
        if(outside.length > 0)
            return { ...cell, direction: randomPick(outside)!.direction };

        return { ...cell, direction: randomPick(adjacent)!.direction };
    }

    protected computeWidth(width?: number): number | undefined {
        if(width) {
            const [ border, cell ] = this.drawingWidth();
            return Math.floor((width - (MARGIN * 2 + border)) / cell);
        }
        return undefined;
    }

    protected computeHeight(height?: number): number | undefined {
        if(height) {
            const [ border, cell ] = this.drawingHeight();
            return Math.floor((height - (MARGIN * 2 + border)) / cell);
        }
        return undefined;
    }

    public draw(): void {
        if(this.context) {
            this.prepareContext();

            this.clear(this.cellColor);

            this.context.fillStyle = this.wallColor;
            for(let x = 0; x < this.width; ++x) {
                for(let y = 0; y < this.height; ++y) {
                    this.drawCell({ x, y });

                    const wall = this.walls[x][y];
                    for(const direction of this.directions)
                        if(wall[direction]) this.drawWall({ x, y, direction });

                    for(const corner of this.corners)
                        if(corner[0] in wall && corner[1] in wall) this.drawPillar({ x, y, corner });
                }
            }

            const x0 = 0;
            const y0 = 0;
            const x1 = this.width  - 1;
            const y1 = this.height - 1;
            const edges: Cell[] = [];
            for(let x = 0; x < this.width; ++x)
                edges.push({ x, y: y0 }, { x, y: y1 });
            for(let y = 0; y < this.height; ++y)
                edges.push({ x: x0, y }, { x: x1, y });

            for(const edge of edges) {
                for(const outside of this.adjacent(edge).filter(cell => !this.inMaze(cell))) {
                    const { direction } = outside;

                    if(this.walls[edge.x][edge.y][direction])
                        this.drawWall({ ...outside, direction: this.opposite(direction) });

                    for(const corner of this.corners) {
                        if(corner.includes(this.opposite(direction)))
                            this.drawPillar({ ...outside, corner });
                    }
                }
            }

            // this.drawPillar({ x: x0, y: y0, corner: 'SE' });
            // this.drawPillar({ x: x1, y: y0, corner: 'SW' });
            // this.drawPillar({ x: x0, y: y1, corner: 'NE' });
            // this.drawPillar({ x: x1, y: y1, corner: 'NW' });
        }
    }

    public drawCell(cell: Cell, cellColor = this.cellColor, wallColor = this.wallColor): void {
        this.drawFloor(cell, cellColor);

        const wall = this.walls[cell.x][cell.y];
        for(const direction of this.directions)
            if(wall[direction]) this.drawWall({ ...cell, direction }, wallColor);

        for(const corner of this.corners)
            if(corner[0] in wall && corner[1] in wall) this.drawPillar({ ...cell, corner }, this.wallColor);
    }

    public adjacent(
        cell: Cell,
        { dirs = this.directions }: { dirs?: Direction[] } = {}
    ): CellDirection[] {
        return dirs
        .map(direction => this.move(cell, direction))
        .filter(c => c !== null) as CellDirection[];
    }

    public neighbors(
        cell: Cell,
        { dirs = this.directions }: { dirs?: Direction[] } = {}
    ): CellDirection[] {
        return this.adjacent(cell, { dirs }).filter(c => this.inMaze(c));
    }

    public validMoves(
        cell: Cell,
        { dirs = this.directions, walls = this.walls }: { dirs?: Direction[]; walls?: Wall[][] } = {}
    ): CellDirection[] {
        return this.neighbors(cell, { dirs }).filter(cd => !walls[cell.x][cell.y][cd.direction]);
    }

    public sides(cell: Cell): number {
        let s = 0;
        for(const direction of this.directions) {
            if(this.walls[cell.x][cell.y][direction])
                s++;
        }
        return s;
    }

    public deadEnds(): Cell[] {
        const ends: Cell[] = [];

        for(let x = 0; x < this.width; ++x) {
            for(let y = 0; y < this.height; ++y) {
                if(this.isDeadEnd({ x, y }))
                    ends.push({ x, y });
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
        if(x >= this.width) {
            x = 0;
            y++;
        }

        return { x, y };
    }

    public prepareContext(context?: CanvasRenderingContext2D): void {
        if(context)
            this.context = context;

        if(this.context) {
            const [ wBorder, wCell ] = this.drawingWidth();
            const [ hBorder, hCell ] = this.drawingHeight();

            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.translate(
                Math.floor((this.context.canvas.width  - (wBorder + this.width * wCell)) / 2),
                Math.floor((this.context.canvas.height - (hBorder + this.height * hCell)) / 2),
            );
        }
    }

    public clear(color?: string): void {
        if(this.context) {
            const [ wBorder, wCell ] = this.drawingWidth();
            const [ hBorder, hCell ] = this.drawingHeight();

            if(color) {
                this.context.fillStyle = color;
                this.context.fillRect(
                    -(this.wallSize + MARGIN),
                    -(this.wallSize + MARGIN),
                    MARGIN * 2 + wBorder + this.width  * wCell,
                    MARGIN * 2 + hBorder + this.height * hCell,
                );
            } else {
                this.context.clearRect(
                    -(this.wallSize + MARGIN),
                    -(this.wallSize + MARGIN),
                    MARGIN * 2 + wBorder + this.width  * wCell,
                    MARGIN * 2 + hBorder + this.height * hCell,
                );
            }
        }
    }

    public removeWall(cell: Cell, direction: Direction): void {
        if(this.inMaze(cell)) {
            this.walls[cell.x][cell.y][direction] = false;
            this.drawCell(cell);
            //this.drawWall({ ...cell, direction }, this.cellColor);

            const cell2 = this.move(cell, direction);
            if(cell2 && this.inMaze(cell2)) {
                this.walls[cell2.x][cell2.y][this.opposite(direction)] = false;
                this.drawCell(cell2);
                //this.drawWall({ ...cell2, direction: this.opposite(direction) }, this.cellColor);
            }
        }
    }

    public removeInteriorWalls(): void {
        for(let x = 0; x < this.width; ++x) {
            for(let y = 0; y < this.height; ++y) {
                for(const neighbor of this.neighbors({ x, y }))
                    this.removeWall({ x, y }, neighbor.direction);
            }
        }
    }

    public addWall(cell: Cell, direction: Direction): void {
        if(this.inMaze(cell)) {
            this.walls[cell.x][cell.y][direction] = true;
            //this.drawWall({ ...cell, direction }, , this.wallColor));
            this.drawCell(cell);

            const cell2 = this.move(cell, direction);
            if(cell2 && this.inMaze(cell2)) {
                this.walls[cell2.x][cell2.y][this.opposite(direction)] = true;
                //this.drawWall({ ...cell2, direction: this.opposite(direction) }, this.wallColor);
                this.drawCell(cell2);
            }
        }
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

    // public braid() {
    //     return new Promise<void>(resolve => {
    //         let x = 0;
    //         let y = 0;
    //         const go = () => {
    //             if(this.sides({ x, y }) === 3) {
    //                 requestAnimationFrame(
    //                     () => {
    //                         const neighbors = this.neighbors({ x, y }).filter(cell => this.walls[x][y][cell.direction]);
    //                         if(this.neighbors.length) {
    //                             const index = Math.floor(neighbors.length * Math.random());
    //                             this.removeWall({ x, y }, neighbors[index].direction);
    //                         }

    //                         x++;
    //                         if(x >= this.width) { x = 0; y++; }
    //                         if(y < this.height) go(); else resolve();
    //                     }
    //                 );
    //             } else {
    //                 x++;
    //                 if(x >= this.width) { x = 0; y++; }
    //                 if(y < this.height) go(); else resolve();
    //             }
    //         };
    //         go();
    //     });
    // }

    protected abstract drawingWidth():  [border: number, cell: number];
    protected abstract drawingHeight(): [border: number, cell: number];
    protected abstract initialWalls(x: number, y: number): Wall;

    public abstract opposite(direction: Direction): Direction;
    public abstract move(cell: Cell, direction: Direction): CellDirection | null;
    public abstract isDeadEnd(cell: Cell): boolean;
    public abstract edges(cell: Cell): Direction[];
    public abstract divider(cell1: Cell, cell2: Cell): CellDirection[];

    public abstract drawFloor(cell: Cell, color?: string): void;
    public abstract drawWall(cd: CellDirection, color?: string): void;
    public abstract drawPillar(cell: CellCorner, color?: string): void;
    public abstract drawPath(cell: CellDirection, color?: string): void;
    public abstract drawX(cell: Cell, color?: string, cellColor?: string): void;

    public abstract rightTurn(direction: Direction): Direction[];
    public abstract leftTurn(direction: Direction): Direction[];
}

export default Maze;

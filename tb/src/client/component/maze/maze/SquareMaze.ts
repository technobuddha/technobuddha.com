import range from 'lodash/range';
import { Maze } from './Maze';
import type { Cell, CellDirection, CellCorner, Direction, MazeProperties, Wall } from './Maze';

export class SquareMaze extends Maze {
    constructor({ cellSize = 67, wallSize = 1, ...props }: MazeProperties) {
        super({ cellSize, wallSize, ...props }, [ 'N', 'E', 'W', 'S' ], [ 'NE', 'NW', 'SE', 'SW' ]);
    }

    protected drawingWidth(): [border: number, cell: number] {
        return [ this.wallSize * 2, this.cellSize ];
    }

    protected drawingHeight(): [border: number, cell: number] {
        return [ this.wallSize * 2, this.cellSize ];
    }

    protected initialWalls(): Wall {
        return { N: true, E: true, W: true, S: true };
    }

    public opposite(direction: Direction): Direction {
        switch(direction) {
            case 'N':   return 'S';
            case 'E':   return 'W';
            case 'W':   return 'E';
            case 'S':   return 'N';
            default:    throw new Error(`"${direction}" is not a valid direction`);
        }
    }

    public rightTurn(direction: Direction): Direction[] {
        switch(direction) {
            case 'N':   return [ 'E', 'N', 'W', 'S' ];
            case 'E':   return [ 'S', 'E', 'N', 'W' ];
            case 'W':   return [ 'N', 'W', 'S', 'E' ];
            case 'S':   return [ 'W', 'S', 'E', 'N' ];
            default:    throw new Error(`"${direction}" is not a valid direction`);
        }
    }

    public leftTurn(direction: Direction): Direction[] {
        switch(direction) {
            case 'N':   return [ 'W', 'N', 'E', 'S' ];
            case 'E':   return [ 'N', 'E', 'S', 'W' ];
            case 'W':   return [ 'S', 'W', 'N', 'E' ];
            case 'S':   return [ 'E', 'S', 'W', 'N' ];
            default:    throw new Error(`"${direction}" is not a valid direction`);
        }
    }

    public move(cell: Cell, direction: Direction): CellDirection {
        switch(direction) {
            case 'N':   return { x: cell.x,     y: cell.y - 1,  direction };
            case 'E':   return { x: cell.x + 1, y: cell.y,      direction };
            case 'W':   return { x: cell.x - 1, y: cell.y,      direction };
            case 'S':   return { x: cell.x,     y: cell.y + 1,  direction };
            default:    throw new Error(`"${direction}" is not a valid direction`);
        }
    }

    public isDeadEnd(cell: Cell): boolean {
        return this.sides(cell) === 3 &&
            (cell.x !== this.entrance.x || cell.y !== this.entrance.y) &&
            (cell.x !== this.exit.x || cell.y !== this.exit.y);
    }

    public edges(cell: Cell): string[] {
        return this.neighbors(cell, { dirs: [ 'S', 'W' ]}).map(cd => cd.direction);
    }

    public divider(cell1: Cell, cell2: Cell): CellDirection[] {
        if(cell1.x === cell2.x)
            return range(cell1.y, cell2.y).map(y => ({ x: cell1.x, y, direction: 'E' }));
        else if(cell1.y === cell2.y)
            return range(cell1.x, cell2.x).map(x => ({ x, y: cell1.y, direction: 'S' }));

        throw new Error('Cells must be aligned vertically or horizontally');
    }

    private offsets({ x, y }: Cell): Record<string, number> {
        const margin = Math.floor(this.cellSize / 8);

        const x0 = x  * this.cellSize;
        const x1 = x0 + this.wallSize;
        const x2 = x1 + margin;
        const x5 = x0 + this.cellSize;
        const x4 = x5 - this.wallSize;
        const x3 = x4 - margin;
        const xc = (x0 + x5) / 2;

        const y0 = y  * this.cellSize;
        const y1 = y0 + this.wallSize;
        const y2 = y1 + margin;
        const y5 = y0 + this.cellSize;
        const y4 = y5 - this.wallSize;
        const y3 = y4 - margin;
        const yc = (y0 + y5) / 2;

        return { x0, x1, x2, xc, x3, x4, x5, y0, y1, y2, yc, y3, y4, y5 };
    }

    public drawFloor(cell: Cell, color = this.cellColor): void {
        if(this.context) {
            const { x0, x5, y0, y5 } = this.offsets(cell);

            this.context.fillStyle = color;
            this.context.beginPath();
            this.context.moveTo(x0, y0);
            this.context.lineTo(x5, y0);
            this.context.lineTo(x5, y5);
            this.context.lineTo(x0, y5);
            this.context.fill();
        }
    }

    public drawWall(cd: CellDirection, color = this.wallColor): void {
        if(this.context) {
            const { x0, x1, x4, x5, y0, y1, y4, y5 } = this.offsets(cd);

            this.context.fillStyle = color;
            switch(cd.direction) {
                case 'N':   this.context.fillRect(x1, y0, x4 - x1, y1 - y0);    break;
                case 'S':   this.context.fillRect(x1, y4, x4 - x1, y5 - y4);    break;
                case 'E':   this.context.fillRect(x4, y1, x5 - x4, y4 - y1);    break;
                case 'W':   this.context.fillRect(x0, y1, x1 - x0, y4 - y1);    break;
            }
        }
    }

    public drawPillar({ x, y, corner }: CellCorner, color = this.wallColor): void {
        if(this.context) {
            const { x0, x1, x4, x5, y0, y1, y4, y5 } = this.offsets({ x, y });

            this.context.fillStyle = color;
            if(corner === 'NW') this.context.fillRect(x0, y0, x1 - x0, y1 - y0);
            if(corner === 'NE') this.context.fillRect(x4, y0, x5 - x4, y1 - y0);
            if(corner === 'SW') this.context.fillRect(x0, y4, x1 - x0, y5 - y4);
            if(corner === 'SE') this.context.fillRect(x4, y4, x5 - x4, y5 - y4);
        }
    }

    public drawPath(cell: CellDirection, color = 'red'): void {
        if(this.context) {
            const { x1, x2, xc, x3, x4, y1, y2, yc, y3, y4 } = this.offsets(cell);

            this.context.fillStyle = color;
            this.context.clearRect(x1, y1, x4 - x1, y4 - y1);

            switch(cell.direction) {
                case 'N':
                    this.context.beginPath();
                    this.context.moveTo(x2, y3);
                    this.context.lineTo(xc, y2);
                    this.context.lineTo(x3, y3);
                    this.context.closePath();
                    this.context.fill();
                    break;
                case 'S':
                    this.context.beginPath();
                    this.context.moveTo(x2, y2);
                    this.context.lineTo(xc, y3);
                    this.context.lineTo(x3, y2);
                    this.context.closePath();
                    this.context.fill();
                    break;
                case 'E':
                    this.context.beginPath();
                    this.context.moveTo(x2, y2);
                    this.context.lineTo(x3, yc);
                    this.context.lineTo(x2, y3);
                    this.context.closePath();
                    this.context.fill();
                    break;
                case 'W':
                    this.context.beginPath();
                    this.context.moveTo(x3, y2);
                    this.context.lineTo(x2, yc);
                    this.context.lineTo(x3, y3);
                    this.context.closePath();
                    this.context.fill();
                    break;
            }
        }
    }

    public drawX(cell: Cell, color = 'black', cellColor = this.cellColor): void {
        if(this.context) {
            const { x1, x4, y1, y4 } = this.offsets(cell);

            this.drawCell(cell, cellColor);

            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x4, y4);
            this.context.moveTo(x1, y4);
            this.context.lineTo(x4, y1);
            this.context.stroke();
        }
    }

    public override toString(): string {
        let str = '';

        for(let y = 0; y < this.height; ++y) {
            for(let x = 0; x < this.width; ++x)
                str += this.walls[x][y].N ? '+==' : '+  ';
            str += '+\n';
            for(let x = 0; x < this.width; ++x)
                str += this.walls[x][y].W ? '|  ' : '   ';
            str += this.walls[this.width - 1][y].E ? '|\n' : ' \n';
        }
        for(let x = 0; x < this.width; ++x)
            str += this.walls[x][this.height - 1].S ? '+==' : '+  ';
        str += '+\n';

        return str;
    }
}

export default SquareMaze;

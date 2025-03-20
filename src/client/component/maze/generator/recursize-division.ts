import type { Cell, CellDirection } from '../maze/maze';
import { MazeGenerator } from './maze-generator';
import type { MazeGeneratorProperties } from './maze-generator';

type Rect = { x: number; y: number; width: number; height: number };

export class RecursiveDivision extends MazeGenerator {
  private readonly walls: CellDirection[];

  constructor(props: MazeGeneratorProperties) {
    super(props);
    this.walls = [];

    this.maze.removeInteriorWalls();

    const stack: Rect[] = [{ x: 0, y: 0, width: this.maze.width, height: this.maze.height }];

    while (stack.length > 0) {
      const border: CellDirection[] = [];
      const region = stack.pop()!;

      if (
        region.width < region.height ? true
        : region.width > region.height ? false
        : this.random() > 0
      ) {
        //Horizontal
        const wall: Cell = {
          x: region.x,
          y: region.y + Math.floor(this.random() * (region.height - 2)),
        };

        border.push(...this.maze.divider(wall, { x: wall.x + region.width, y: wall.y }));

        const index = Math.floor(this.random() * border.length);
        //this.maze.drawWall(border[index], 'yellow');
        border.splice(index, 1);
        //border.forEach(b => this.maze.addWall(b, b.direction));
        this.walls.push(...border);

        let width = region.width;
        let height = wall.y - region.y + 1;

        if (width >= 2 && height >= 2) stack.push({ x: region.x, y: region.y, width, height });

        let x = region.x;
        let y = wall.y + 1;
        width = region.width;
        height = region.y + region.height - wall.y - 1;

        if (width >= 2 && height >= 2) stack.push({ x, y, width, height });
      } else {
        //Vertical
        const wall: Cell = {
          x: region.x + Math.floor(this.random() * (region.width - 2)),
          y: region.y,
        };

        border.push(...this.maze.divider(wall, { x: wall.x, y: wall.y + region.height }));

        border.splice(Math.floor(this.random() * border.length), 1);
        //border.forEach(b => this.maze.addWall(b, b.direction));
        this.walls.push(...border);

        let width = wall.x - region.x + 1;
        let height = region.height;

        if (width >= 2 && height >= 2) stack.push({ x: region.x, y: region.y, width, height });

        let x = wall.x + 1;
        let y = region.y;
        width = region.x + region.width - wall.x - 1;
        height = region.height;

        if (width >= 2 && height >= 2) stack.push({ x, y, width, height });
      }
    }
  }

  public override step(): boolean {
    if (this.walls.length > 0) {
      const wall = this.walls.shift()!;
      this.maze.addWall(wall, wall.direction);
      return true;
    }

    return false;
  }
}

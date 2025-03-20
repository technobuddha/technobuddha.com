import { type Cell, type CellDirection } from '../../maze/maze.js';

import { type MazeGeneratorProperties } from '../maze-generator.js';
import { MazeGenerator } from '../maze-generator.js';

type Rect = { x: number; y: number; width: number; height: number };

export class RecursiveDivision extends MazeGenerator {
  private readonly walls: (CellDirection & { gap: boolean })[];

  public constructor(props: MazeGeneratorProperties) {
    super(props);
    this.walls = [];

    this.maze.removeInteriorWalls();

    const stack: Rect[] = [{ x: 0, y: 0, width: this.maze.width, height: this.maze.height }];

    while (stack.length > 0) {
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

        const border = this.maze
          .divider(wall, { x: wall.x + region.width, y: wall.y })
          .filter((b) => {
            const m = this.maze.move({ x: b.x, y: b.y }, b.direction)!;
            return (
              !this.walls.some((w) => w.x === b.x && w.y === b.y && w.direction === b.direction) &&
              !this.walls.some(
                (w) =>
                  w.x === m.x && m.y === w.y && this.maze.opposite(b.direction) === w.direction,
              )
            );
          })
          .map((b) => ({ ...b, gap: false }));

        if (border.length > 0) {
          border[Math.floor(this.random() * border.length)].gap = true;
          this.walls.push(...border);
        }

        let { width } = region;
        let height = wall.y - region.y + 1;

        if (width >= 2 && height >= 2) {
          stack.push({ x: region.x, y: region.y, width, height });
        }

        const { x } = region;
        const y = wall.y + 1;
        ({ width } = region);
        height = region.y + region.height - wall.y - 1;

        if (width >= 2 && height >= 2) {
          stack.push({ x, y, width, height });
        }
      } else {
        //Vertical
        const wall: Cell = {
          x: region.x + Math.floor(this.random() * (region.width - 2)),
          y: region.y,
        };

        const border = this.maze
          .divider(wall, { x: wall.x, y: wall.y + region.height })
          .filter((b) => {
            const m = this.maze.move({ x: b.x, y: b.y }, b.direction)!;
            return (
              !this.walls.some((w) => w.x === b.x && w.y === b.y && w.direction === b.direction) &&
              !this.walls.some(
                (w) =>
                  w.x === m.x && m.y === w.y && this.maze.opposite(b.direction) === w.direction,
              )
            );
          })
          .map((b) => ({ ...b, gap: false }));

        if (border.length > 0) {
          border[Math.floor(this.random() * border.length)].gap = true;
          this.walls.push(...border);
        }

        let width = wall.x - region.x + 1;
        let { height } = region;

        if (width >= 2 && height >= 2) {
          stack.push({ x: region.x, y: region.y, width, height });
        }

        const x = wall.x + 1;
        const { y } = region;
        width = region.x + region.width - wall.x - 1;
        ({ height } = region);

        if (width >= 2 && height >= 2) {
          stack.push({ x, y, width, height });
        }
      }
    }
  }

  public override step(): boolean {
    while (this.walls.length > 0 && this.walls[0].gap) {
      this.walls.shift();
    }
    if (this.walls.length > 0) {
      const wall = this.walls.shift()!;
      this.maze.addWall(wall, wall.direction);
      return true;
    }

    return false;
  }
}

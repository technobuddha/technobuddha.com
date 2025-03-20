import { type Drawing } from '../drawing/drawing.js';
import { type MazeGenerator, type MazeGeneratorProperties } from '../generator/maze-generator.js';

import { type Maze, type MazeProperties } from './maze.js';

export type MazeSettings = Partial<MazeProperties> & Partial<MazeGeneratorProperties>;

export class MazeFactory {
  public context: Drawing | undefined;
  public width: MazeSettings['width'];
  public height: MazeSettings['height'];
  public cellSize: MazeSettings['cellSize'];
  public cellColor: MazeSettings['cellColor'];
  public wallSize: MazeSettings['wallSize'];
  public wallColor: MazeSettings['wallColor'];
  public entrance: MazeSettings['entrance'];
  public exit: MazeSettings['exit'];
  public start: MazeSettings['start'];
  public random: MazeSettings['random'];

  public constructor({
    drawing: context,
    random = Math.random,
    width,
    height,
    cellSize,
    cellColor,
    wallSize,
    wallColor,
    entrance = 'top left',
    exit = 'bottom right',
    start = 'random',
  }: MazeSettings = {}) {
    this.context = context;
    this.random = random;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cellColor = cellColor;
    this.wallSize = wallSize;
    this.wallColor = wallColor;
    this.entrance = entrance;
    this.exit = exit;
    this.start = start;
  }

  public async create(
    mazeMaker: (props: MazeSettings) => Maze,
    generator?: (props: MazeGeneratorProperties) => MazeGenerator,
  ): Promise<Maze> {
    const maze = mazeMaker({
      drawing: this.context,
      width: this.width,
      height: this.height,
      cellSize: this.cellSize,
      cellColor: this.cellColor,
      wallSize: this.wallSize,
      wallColor: this.wallColor,
      entrance: this.entrance,
      exit: this.exit,
    });

    if (generator) {
      const mg = generator({
        maze,
        start: this.start,
        random: this.random,
      });
      return mg.generate();
    }

    maze.draw();
    return maze;
  }
}

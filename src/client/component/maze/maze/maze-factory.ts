import type { Maze, MazeProperties } from './maze';
import type { MazeGenerator, MazeGeneratorProperties } from '../generator/maze-generator';

export type MazeSettings = Partial<MazeProperties> & Partial<MazeGeneratorProperties>;

export class MazeFactory {
  public context: CanvasRenderingContext2D | undefined;
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
  public selectNeighbor: MazeSettings['selectNeighbor'];

  constructor({
    context,
    random = Math.random,
    selectNeighbor,
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
    this.selectNeighbor = selectNeighbor;
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
    mazeMaker: (props: MazeProperties) => Maze,
    Generator: typeof MazeGenerator,
    speed = 0,
  ): Promise<Maze> {
    const mg = new Generator({
      maze: mazeMaker({
        context: this.context,
        width: this.width,
        height: this.height,
        cellSize: this.cellSize,
        cellColor: this.cellColor,
        wallSize: this.wallSize,
        wallColor: this.wallColor,
        entrance: this.entrance,
        exit: this.exit,
      }),
      start: this.start,
      selectNeighbor: this.selectNeighbor,
      random: this.random,
    });

    return mg.generate(speed);
  }
}

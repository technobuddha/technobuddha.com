import { type CellDirection } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type DeadEndProperties = MazeSolverProperties & {
  markedColor?: string;
  method?: 'cul-de-sac' | 'dead-end';
};

export class Filler extends MazeSolver {
  public markedColor: string;
  protected method: DeadEndProperties['method'];

  public constructor({
    markedColor = '#EF3E36',
    method = 'cul-de-sac',
    ...props
  }: DeadEndProperties) {
    super(props);
    this.markedColor = markedColor;
    this.method = method;
  }

  public *solve({ markedColor = this.markedColor, exit = this.maze.exit } = {}): Iterator<void> {
    const walls = this.maze.backup();

    while (true) {
      const deadEnds = this.randomShuffle(this.maze.deadEnds());
      if (deadEnds.length === 0) {
        break;
      }

      if (this.method === 'cul-de-sac') {
        for (const deadEnd of deadEnds) {
          for (let culdesac = deadEnd; this.maze.isDeadEnd(culdesac); ) {
            const [move] = this.maze.validMoves(culdesac);
            this.maze.addWall(culdesac, move.direction, false);
            this.maze.drawX(this.maze.drawCell(culdesac), markedColor);
            yield;
            culdesac = { x: move.x, y: move.y };
          }
        }
      } else {
        for (const deadEnd of deadEnds) {
          const [move] = this.maze.validMoves(deadEnd);
          this.maze.addWall(deadEnd, move.direction, false);
          this.maze.drawX(this.maze.drawCell(deadEnd), markedColor);
          yield;
        }
      }
    }

    let cell = {
      ...this.maze.entrance,
      direction: this.maze.opposite(this.maze.entrance),
    };
    const path: CellDirection[] = [cell];
    while (!this.maze.isSame(cell, exit)) {
      const moves = this.maze
        .validMoves(cell)
        .filter((m) => !path.some((p) => this.maze.isSame(p, m)));

      if (moves.length > 1) {
        throw new Error('Multiple paths found');
      }

      const [move] = moves;
      this.maze.solution.push({ ...cell, direction: move.direction });
      path.push(cell);
      cell = move;
    }

    this.maze.restore(walls);
  }
}

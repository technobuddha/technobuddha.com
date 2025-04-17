import { type CellDirection } from '../maze/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type DeadEndProperties = MazeSolverProperties & {
  markedColor?: string;
  method?: 'cul-de-sac' | 'dead-end';
};

export class Filler extends MazeSolver {
  public markedColor: string;
  protected method: DeadEndProperties['method'];

  public constructor({
    markedColor = '#C74133',
    method = 'cul-de-sac',
    ...props
  }: DeadEndProperties) {
    super(props);
    this.markedColor = markedColor;
    this.method = method;
  }

  public *solve({
    markedColor = this.markedColor,
    solutionColor = this.solutionColor,
    exit = this.maze.exit,
  } = {}): Iterator<void> {
    const walls = this.maze.cloneWalls();
    this.maze.attachDrawing(this.drawing);

    let deadEnds = this.randomShuffle(this.maze.deadEnds({ walls }));
    while (deadEnds.length > 0) {
      for (const deadEnd of deadEnds) {
        if (this.method === 'cul-de-sac') {
          for (let cell = deadEnd; this.maze.isDeadEnd(cell, { walls }); ) {
            const [move] = this.maze.validMoves(cell, { walls });
            this.maze.addWall(cell, move.direction, { walls }, false);
            this.maze.drawX(cell, markedColor);
            yield;
            cell = { x: move.x, y: move.y };
          }
        } else {
          const moves = this.maze.validMoves(deadEnd, { walls });

          for (const move of moves) {
            this.maze.addWall(deadEnd, move.direction, { walls }, false);
          }

          this.maze.drawX(deadEnd, markedColor);
          yield;
        }
      }
      deadEnds = this.randomShuffle(this.maze.deadEnds({ walls }));
    }

    this.maze.clear();
    this.maze.drawDistances();

    let cell = {
      ...this.maze.entrance,
      direction: this.maze.opposite(this.maze.entrance),
    };
    const path: CellDirection[] = [cell];
    while (!this.maze.isSame(cell, exit)) {
      const moves = this.maze
        .validMoves(cell, { walls })
        .filter((m) => !path.some((p) => this.maze.isSame(p, m)));

      if (moves.length > 1) {
        throw new Error('Multiple paths found');
      }

      const [move] = moves;
      this.maze.drawPath({ ...cell, direction: move.direction }, solutionColor);
      path.push(cell);
      cell = move;
    }

    this.maze.drawCell(exit);
    this.maze.drawPath(exit, solutionColor);
  }
}

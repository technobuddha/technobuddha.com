import { MazeSolver } from './maze-solver';

export class DeadEndFiller extends MazeSolver {
  public async solve(): Promise<void> {
    const walls = this.maze.walls.map((row) => [...row]);

    this.maze.prepareContext(this.context);
    return new Promise<void>((resolve) => {
      const deadEnds = this.maze.deadEnds();
      for (const end of deadEnds) this.maze.drawX(end, 'red');

      const go = () => {
        if (deadEnds.length > 0) {
          const index = Math.floor(deadEnds.length * Math.random());
          let cell = deadEnds[index];
          deadEnds.splice(index, 1);

          const gogo = () => {
            requestAnimationFrame(() => {
              if (cell) {
                const moves = this.maze.validMoves(cell, { walls });

                if (this.maze.isDeadEnd(cell)) {
                  for (const direction of this.maze.directions) {
                    if (!walls[cell.x][cell.y][direction]) {
                      walls[cell.x][cell.y][direction] = true;
                      this.maze.drawWall({ ...cell, direction });

                      const cell2 = this.maze.move(cell, direction);
                      if (cell2 && this.maze.inMaze(cell2)) {
                        walls[cell2.x][cell2.y][this.maze.opposite(direction)] = true;
                        this.maze.drawWall({ ...cell2, direction: this.maze.opposite(direction) });
                      }
                    }
                  }

                  this.maze.drawCell(cell, this.maze.wallColor);
                  [cell] = moves;
                  gogo();
                } else {
                  go();
                }
              }
            });
          };
          gogo();
        } else {
          resolve();
        }
      };
      go();
    });
  }
}

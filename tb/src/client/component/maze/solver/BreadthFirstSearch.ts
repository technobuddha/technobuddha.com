import create2DArray        from '@technobuddha/library/create2DArray';
import randomShuffle              from '@technobuddha/library/randomShuffle';
import type { Cell, Direction }        from '../maze/Maze';

import { MazeSolver } from './MazeSolver';
import type { SolveArguments } from './MazeSolver';

type DD = {
    dir?: Direction;
    dist: number;
};

export class BreadthFirstSearch extends MazeSolver {
    public async solve({ color = 'lime', entrance = this.maze.entrance, exit = this.maze.exit }: SolveArguments = {}): Promise<void> {
        this.maze.prepareContext(this.context);

        return new Promise<void>(resolve => {
            const queue: Cell[] = [];
            const distances     = create2DArray(this.maze.width, this.maze.height, () => ({ dist: Infinity } as DD));
            distances[entrance.x][entrance.y]  = { dist: 0 };
            queue.unshift(entrance);
            this.maze.drawCell(entrance, color);

            for(const direction of this.maze.directions) {
                if(!this.maze.walls[entrance.x][entrance.y][direction])
                    this.maze.drawWall({ ...entrance, direction }, color);
            }

            const go = () => {
                requestAnimationFrame(
                    () => {
                        if(queue.length > 0) {
                            const cell      = queue.pop()!;

                            if(cell.x === exit.x && cell.y === exit.y) {
                                queue.length = 0;
                                go();
                            } else {
                                const distance  = distances[cell.x][cell.y].dist + 1;
                                const neighbors = randomShuffle(
                                    this.maze.validMoves(cell)
                                    .filter(n => distances[n.x][n.y].dist > distance)
                                );

                                for(const neighbor of neighbors) {
                                    distances[neighbor.x][neighbor.y]  = { dir: neighbor.direction, dist: distance };
                                    this.maze.drawCell(neighbor, color);
                                    for(const direction of this.maze.directions) {
                                        if(this.maze.walls[neighbor.x][neighbor.y][direction] === false)
                                            this.maze.drawWall({ ...neighbor, direction }, color);
                                    }
                                    queue.unshift(neighbor);
                                }
                                go();
                            }
                        } else {
                            this.maze.clear();

                            let cell = { ...exit, direction: this.maze.opposite(exit.direction) };
                            for(;;) {
                                this.maze.drawPath({ ...cell, direction: this.maze.opposite(cell.direction) }, color);
                                if(cell.x === entrance.x && cell.y === entrance.y)
                                    break;
                                cell = this.maze.move(cell, this.maze.opposite(distances[cell.x][cell.y].dir!))!;
                            }
                            resolve();
                        }
                    }
                );
            };
            go();
        });
    }
}

export default BreadthFirstSearch;

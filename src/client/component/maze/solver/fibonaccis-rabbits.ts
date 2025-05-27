import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type Rabbit = {
  cell: Cell;
  age: number;
  tail: Cell;
};

type FibonaccisRabbitsProperties = MazeSolverProperties;

export class FibonaccisRabbits extends MazeSolver {
  public constructor(props: FibonaccisRabbitsProperties) {
    super(props);
  }

  public *solve({ entrance = this.maze.entrance, exit = this.maze.exit } = {}): Iterator<void> {
    const currentCount = create2DArray(this.maze.width, this.maze.height, 0);
    const lastCount = create2DArray(this.maze.width, this.maze.height, 0);
    let rabbits: Rabbit[] = [{ cell: entrance, age: 0, tail: entrance }];
    currentCount[entrance.x][entrance.y]++;

    while (true) {
      const currGeneration = [...rabbits];
      rabbits = [];
      for (const rabbit of currGeneration) {
        rabbit.age++;
        if (rabbit.age <= 100) {
          rabbits.push(rabbit);
          if (rabbit.age % 20 === 0 && rabbit.age !== 20) {
            currentCount[rabbit.cell.x][rabbit.cell.y]++;
            rabbits.push({ cell: { ...rabbit.cell }, age: 0, tail: { ...rabbit.cell } });
          }
        } else {
          currentCount[rabbit.cell.x][rabbit.cell.y]--;
        }
      }

      for (const rabbit of rabbits) {
        const next =
          this.randomPick(
            this.maze
              .validMoves(rabbit.cell)
              .filter(({ move }) => !this.maze.isSame(move, rabbit.tail))
              .map(({ move }) => move),
          ) ?? rabbit.tail;

        currentCount[rabbit.cell.x][rabbit.cell.y]--;
        currentCount[next.x][next.y]++;

        rabbit.tail = rabbit.cell;
        rabbit.cell = next;

        if (this.maze.isSame(next, exit)) {
          return;
        }
      }

      for (const cell of this.maze.cellsInMaze().filter((c) => currentCount[c.x][c.y] > 3)) {
        currentCount[cell.x][cell.y]--;
        rabbits.splice(
          rabbits.findIndex((r) => this.maze.isSame(cell, r.cell)),
          1,
        );
      }

      for (const cell of this.maze.cellsInMaze()) {
        if (currentCount[cell.x][cell.y] !== lastCount[cell.x][cell.y]) {
          this.maze.drawCell(cell);

          if (currentCount[cell.x][cell.y] > 0) {
            this.maze.drawAvatar(cell, currentCount[cell.x][cell.y] > 1 ? 'red' : 'pink');
          }
          // if (currentCount[cell.x][cell.y] > 1) {
          //   this.maze.drawText(cell, currentCount[cell.x][cell.y].toString(), 'black');
          // }

          lastCount[cell.x][cell.y] = currentCount[cell.x][cell.y];
        }
      }
      yield;
    }
  }
}

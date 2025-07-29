import { create2DArray } from '@technobuddha/library';

import { type CellFacing } from '../geometry/index.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type Rabbit = {
  cell: CellFacing;
  age: number;
  tail: CellFacing;
  history: CellFacing[];
};

export type FibonaccisRabbitsProperties = MazeSolverProperties & {
  readonly lifeSpan?: number;
  readonly gestationPeriod?: number;
  readonly populationLimit?: number;
  readonly rabbitColor?: string;
  readonly fluffleColor?: string;
};

export class FibonaccisRabbits extends MazeSolver {
  protected readonly lifeSpan: NonNullable<FibonaccisRabbitsProperties['lifeSpan']>;
  protected readonly gestationPeriod: NonNullable<FibonaccisRabbitsProperties['gestationPeriod']>;
  protected readonly populationLimit: NonNullable<FibonaccisRabbitsProperties['populationLimit']>;
  protected readonly rabbitColor: NonNullable<FibonaccisRabbitsProperties['rabbitColor']>;
  protected readonly fluffleColor: NonNullable<FibonaccisRabbitsProperties['fluffleColor']>;
  protected maxRabbits = 0;

  public constructor({
    lifeSpan = 100,
    gestationPeriod = 20,
    populationLimit = 2,
    rabbitColor = 'oklch(0.8677 0.0735 7.09)',
    fluffleColor = 'oklch(0.628 0.2577 29.23)',
    ...props
  }: FibonaccisRabbitsProperties) {
    super(props);
    this.lifeSpan = lifeSpan;
    this.gestationPeriod = gestationPeriod;
    this.populationLimit = populationLimit;
    this.rabbitColor = rabbitColor;
    this.fluffleColor = fluffleColor;
  }

  public async *solve({
    entrance = this.maze.entrance,
    exit = this.maze.exit,
  } = {}): AsyncGenerator<void> {
    const currentCount = create2DArray(this.maze.width, this.maze.height, 0);
    const lastCount = create2DArray(this.maze.width, this.maze.height, 0);
    let rabbits: Rabbit[] = [{ cell: entrance, age: 0, tail: entrance, history: [entrance] }];
    currentCount[entrance.x][entrance.y]++;

    while (true) {
      this.maxRabbits = Math.max(this.maxRabbits, rabbits.length);

      // Create the next generation of rabbits, culling the old ones and creating new ones
      const currGeneration = [...rabbits];
      rabbits = [];
      for (const rabbit of currGeneration) {
        rabbit.age++;
        if (rabbit.age <= this.lifeSpan) {
          rabbits.push(rabbit);
          if (rabbit.age % this.gestationPeriod === 0 && rabbit.age !== this.gestationPeriod) {
            currentCount[rabbit.cell.x][rabbit.cell.y]++;
            rabbits.push({
              cell: { ...rabbit.cell },
              age: 0,
              tail: { ...rabbit.cell },
              history: [...rabbit.history],
            });
          }
        } else {
          currentCount[rabbit.cell.x][rabbit.cell.y]--;
        }
      }

      for (const rabbit of rabbits) {
        const next =
          this.randomPick(
            this.maze
              .moves(rabbit.cell, { wall: false })
              .filter(({ target }) => !this.maze.isSame(target, rabbit.tail))
              .map(({ target }) => target),
          ) ?? rabbit.tail;

        rabbit.history.push(next);
        currentCount[rabbit.cell.x][rabbit.cell.y]--;
        currentCount[next.x][next.y]++;

        rabbit.tail = rabbit.cell;
        rabbit.cell = next;

        if (this.maze.isSame(next, exit)) {
          this.maze.sendMessage(`${this.maxRabbits} rabbits solved the maze!`, {
            color: this.rabbitColor,
          });
          this.maze.solution = this.maze.makePath(this.maze.flatten(rabbit.history));
          return;
        }
      }

      // Cull the overpopulation
      for (const cell of this.maze
        .cellsInMaze()
        .filter((c) => currentCount[c.x][c.y] > this.populationLimit)) {
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
            this.maze.drawAvatar(
              cell,
              currentCount[cell.x][cell.y] > 1 ? this.fluffleColor : this.rabbitColor,
            );
          }

          lastCount[cell.x][cell.y] = currentCount[cell.x][cell.y];
        }
      }
      yield;
    }
  }
}

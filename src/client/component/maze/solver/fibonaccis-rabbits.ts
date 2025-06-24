import { create2DArray } from '@technobuddha/library';

import { type Cell } from '../geometry/maze.ts';

import { MazeSolver, type MazeSolverProperties } from './maze-solver.ts';

type Rabbit = {
  cell: Cell;
  age: number;
  tail: Cell;
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

  public constructor({
    lifeSpan = 100,
    gestationPeriod = 20,
    populationLimit = 3,
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
    let rabbits: Rabbit[] = [{ cell: entrance, age: 0, tail: entrance }];
    currentCount[entrance.x][entrance.y]++;

    while (true) {
      const currGeneration = [...rabbits];
      rabbits = [];
      for (const rabbit of currGeneration) {
        rabbit.age++;
        if (rabbit.age <= this.lifeSpan) {
          rabbits.push(rabbit);
          if (rabbit.age % this.gestationPeriod === 0 && rabbit.age !== this.gestationPeriod) {
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
              .moves(rabbit.cell, { wall: false })
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

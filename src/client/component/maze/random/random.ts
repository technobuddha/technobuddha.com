import { randomPick, randomShuffle, randomWeightedPick } from '@technobuddha/library';

export type RandomProperties = {
  random?: () => number;
};

export class Random extends EventTarget {
  public readonly random: () => number;

  public constructor({ random = Math.random }: RandomProperties = {}) {
    super();
    this.random = random;
  }

  public randomPick<T>(array: T[]): T | undefined {
    return randomPick(array, this.random);
  }

  public randomWeightedPick<T extends { weight: number }>(array: T[]): T | undefined {
    return randomWeightedPick(array, this.random);
  }

  public randomShuffle<T>(array: T[]): T[] {
    return randomShuffle(array, this.random);
  }

  public randomChance(probability: number): boolean {
    return this.random() < probability;
  }

  public randomNumber(max: number, min = 0): number {
    return Math.floor(this.random() * (max - min)) + min;
  }

  public sendMessage(message: string, color?: string): void {
    this.dispatchEvent(
      new CustomEvent('message', {
        detail: { message, color },
      }),
    );
  }
}

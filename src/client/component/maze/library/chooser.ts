import { isFunction } from 'lodash';

type WeightedKey = `${number}:${string}` | `${number}`;
type Selection<A, B> = (...props: A[]) => B;

interface Choices<A, B> {
  [key: WeightedKey]: Selection<A, B> | Choices<A, B>;
}

export type Choice<A, B> = Selection<A, B> | Choices<A, B>;

export function chooser<A, B>(
  choose: Choice<A, B>,
  seed: string[] = [],
): { name: string; value?: Selection<A, B> } {
  const name: string[] = seed;

  if (isFunction(choose)) {
    return { name: name.join(' '), value: choose };
  }

  const choices = Object.keys(choose).map((c) => {
    const [weight, description] = c.split(':');

    return {
      weight: Number.parseFloat(weight),
      description: description as string | undefined,
      choice: choose[c as WeightedKey],
    };
  });

  if (choices.length > 0) {
    const totalWeight = choices.reduce((acc, c) => acc + c.weight, 0);
    if (totalWeight > 0) {
      let index = Math.random() * totalWeight;
      for (const { weight, description, choice } of choices) {
        index -= weight;
        if (index <= 0) {
          if (description) {
            name.push(description);
          }
          return chooser(choice, name);
        }
      }
      return { name: name.join(' ') };
    }
  }
  return { name: name.join(' ') };
}

export function* allChoices<A, B>(
  choose: Choice<A, B>,
  seed: string[] = [],
): Generator<{ name: string; value?: Selection<A, B> }> {
  const name: string[] = seed;

  if (isFunction(choose)) {
    yield { name: name.join(' '), value: choose };
  } else {
    for (const [key, value] of Object.entries(choose).filter(
      ([k]) => Number.parseFloat(k.split(':')[0]) > 0,
    )) {
      yield* allChoices(value, [...name, key.split(':')[1]]);
    }
  }
}

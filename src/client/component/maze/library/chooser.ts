type Value<Props extends Record<string, unknown>> = {
  title: string;
  props: Props;
};

type Selection<Props extends Record<string, unknown>> = Value<Props> & {
  weight: number;
};

type Choice<Props extends Record<string, unknown>> = {
  weight: number;
  items: Selection<Props>[];
};

export type Choices<Props extends Record<string, unknown> = Record<string, unknown>> = (
  | Selection<Props>
  | Choice<Props>
)[];

export function chooser<Props extends Record<string, unknown>>(
  choices: Choices<Props>,
): Value<Props> | undefined {
  const totalWeight = choices.reduce((acc, choice) => acc + choice.weight, 0);

  let index = Math.random() * totalWeight;
  for (const choice of choices) {
    index -= choice.weight;
    if (index <= 0) {
      if ('items' in choice) {
        return chooser(choice.items);
      }
      return choice;
    }
  }

  return undefined;
}

export function* allChoices<Props extends Record<string, unknown>>(
  choices: Choices<Props>,
): Generator<Value<Props>> {
  for (const choice of choices) {
    if ('items' in choice) {
      yield* allChoices(choice.items);
    } else {
      yield choice;
    }
  }
}

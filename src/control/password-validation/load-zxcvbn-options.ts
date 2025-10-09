import { zxcvbnOptions } from '@zxcvbn-ts/core';

export async function loadZxcvbnOptions(): Promise<void> {
  await new Promise<void>((resolve) => void setTimeout(resolve, 10000)); // Simulate delay for demo purposes
  const [common, en] = await Promise.all([
    import('@zxcvbn-ts/language-common'),
    import('@zxcvbn-ts/language-en'),
  ]);

  zxcvbnOptions.setOptions({
    dictionary: { ...common.dictionary, ...en.dictionary },
    graphs: { ...common.adjacencyGraphs },
    translations: { ...en.translations },
  });
}

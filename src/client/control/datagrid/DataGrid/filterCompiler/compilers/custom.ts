import type { Filter } from '../../filter';
import type { CompilerOptions } from './options';

export type CustomCompilerOptions<T = unknown> = CompilerOptions & {
    type:   'custom';
    filter: (data: T[], clear?: CompilerOptions['clear']) => Filter<T>;
};

export function filterCompilerCustom<T = unknown>(options: CustomCompilerOptions<T>, data: T[]): Filter<T> {
    return options.filter(data, options.clear);
}

export default filterCompilerCustom;

import type { Filter } from '../filter';

export type FilterFactoryCustomOptions<T = unknown> = {   
    type:   'custom',
    filter: (data: T[]) => Filter<T>;
}

export function filterCompilerCustom<T = unknown>(options: FilterFactoryCustomOptions<T>, data: T[]): Filter<T> {
    return options.filter(data);
}

export default filterCompilerCustom;

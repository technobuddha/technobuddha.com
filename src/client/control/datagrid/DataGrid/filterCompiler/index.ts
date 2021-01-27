import { filterCompilerCheckbox } from './checkbox-list';
import { filterCompilerCustom }   from './custom';
import { filterCompilerSearch }   from './search';
import { filterCompilerTransfer } from './transfer';

import type { Filter }                       from '../filter';
import type { AnalyzerResults }              from '../analyzer';
import type { FilterFactoryCustomOptions }   from './custom';
import type { FilterFactoryCheckboxOptions } from './checkbox-list';
import type { FilterFactoryTransferOptions } from './transfer';
import type { FilterFactorySearchOptions }   from './search';

export type FilterSpecification<T = unknown> =
    FilterFactoryCustomOptions<T>   |
    FilterFactoryCheckboxOptions<T> |
    FilterFactoryTransferOptions<T> |
    FilterFactorySearchOptions<T>;

export function filterCompiler<T = unknown>(options: FilterSpecification<T>, data: T[], analysis: AnalyzerResults<T>): Filter<T> {
    switch(options.type) {
        case 'checkbox-list':
            return filterCompilerCheckbox(options, data, analysis);
        case 'transfer':
            return filterCompilerTransfer(options, analysis);
        case 'search':
            return filterCompilerSearch(options, analysis);
        case 'custom':
            return filterCompilerCustom(options, data);
    }
}

export default filterCompiler;

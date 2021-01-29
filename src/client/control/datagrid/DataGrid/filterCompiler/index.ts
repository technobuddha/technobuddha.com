import { filterCompilerCheckbox, filterCompilerCustom, filterCompilerSearch, filterCompilerTransfer } from './compilers';

import type { Filter }           from '../filter';
import type { AnalyzerResults }  from '../analyzer';
import type { CustomCompilerOptions, CheckboxCompilerOptions, TransferCompilerOptions, SearchCompilerOptions } from './compilers';

export type FilterSpecification<T = unknown> =
    CustomCompilerOptions<T>   |
    CheckboxCompilerOptions<T> |
    TransferCompilerOptions<T> |
    SearchCompilerOptions<T>;

export function filterCompiler<T = unknown>(options: FilterSpecification<T>, data: T[], analysis: AnalyzerResults<T>): Filter<T> {
    switch(options.type) {
        case 'checkbox-list':
            return filterCompilerCheckbox(options, data, analysis);
        case 'transfer':
            return filterCompilerTransfer(options, analysis);
        case 'search':
            return filterCompilerSearch(options, analysis);
        case 'custom':
        default:
            return filterCompilerCustom(options, data);
    }
}

export default filterCompiler;

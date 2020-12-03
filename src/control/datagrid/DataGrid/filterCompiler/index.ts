import { Filter }                                               from '../filter';
import { AnalyzerResults }                                      from '../analyzer';
import { filterCompilerCustom,   FilterFactoryCustomOptions }   from './custom';
import { filterCompilerCheckbox, FilterFactoryCheckboxOptions } from './checkbox-list';
import { filterCompilerTransfer, FilterFactoryTransferOptions } from './transfer';
import { filterCompilerSearch,   FilterFactorySearchOptions }   from './search';

export type FilterSpecification<T = unknown> =  
    FilterFactoryCustomOptions<T>   |
    FilterFactoryCheckboxOptions    |
    FilterFactoryTransferOptions    |
    FilterFactorySearchOptions;

export function filterCompiler<T = unknown>(options: FilterSpecification<T>, data: T[], analysis: AnalyzerResults<T>): Filter<T>
{
    switch (options.type)
    {
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

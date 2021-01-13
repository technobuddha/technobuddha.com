import React       from 'react';
import compact     from 'lodash/compact';
import isUndefined from 'lodash/isUndefined';
import { useGrid } from './GridContext';

import type { Column } from './column';

export type SortKey<T = unknown> = T extends string ? boolean : (keyof T | `~${string & keyof T}`);

type SorterProps<T = unknown> = {
    data:               T[];
    columns:            Column<T>[];
    children:           (props: SorterRenderProps<T>) => React.ReactElement;
};

export type SorterRenderProps<T = unknown> = {
    data:               T[];
}

export function Sorter<T = unknown>({data, columns, children}: SorterProps<T>) {
    const { sort } = useGrid<T>();

    if(!isUndefined(sort)) {
        const column = columns.find(col => col.name === sort.sortBy)

        console.log('Sorter', sort.sortBy, sort.sortAscending)

        if(column?.sortBy && column.sortBy.length) {
            const collators = compact(column.sortBy.map(sort => columns.find(col => col.name === sort)?.collate)).map(collate => collate(sort.sortAscending));
            if(collators.length) {
                data.sort((x: T, y: T) => {
                    let result = 0;
                    for(let i = 0; i < collators.length; ++i) {
                        result = collators[i](x, y);
                        if(result !== 0)
                            break;
                    }
                    return result;
                });
            }
        }
    } else console.log('NO SORT COLUMN')

    return children({data});
}

export default Sorter;

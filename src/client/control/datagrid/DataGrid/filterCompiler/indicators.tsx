import React                    from 'react';
import Chip                     from '@material-ui/core/Chip';
import useGrid                  from '../GridContext';
import { normalizeFilterArray } from './normalization';

import type { FilterIndicatorProps } from '../filter';

type IndicatorArgs<T = unknown> = {
    name: keyof T;
    title?: string;
    Icon?: React.ComponentType<{className?: string; style?: React.CSSProperties}>;
};

export function arrayIndicator<T = unknown>({ Icon, name, title }: IndicatorArgs<T>) {
    return function({ classes, styles }: FilterIndicatorProps) {
        const { filterValues, changeFilter }  = useGrid<T>();
        const filterValue                     = normalizeFilterArray(filterValues[name]);

        if(filterValue) {
            let str = '';

            for(let i = filterValue.length; i > 0; --i) {
                str = filterValue.slice(0, i).join(', ');
                if(str.length < 40 || i === 1) {
                    if(filterValue.length > i)
                        str += `, +${filterValue.length - i}…`;
                    break;
                }
            }

            const handleFilterDelete = () => {
                changeFilter(name, null);
            };

            return (
                <Chip
                    className={classes?.root}
                    style={styles?.root}
                    icon={Icon && <Icon />}
                    color="secondary"
                    label={`${title ?? name}: ${str}`}
                    onDelete={handleFilterDelete}
                />
            );
        } else
            return <></>;
    };
}

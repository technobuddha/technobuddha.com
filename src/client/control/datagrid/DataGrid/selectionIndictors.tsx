import React        from 'react';
import Checkbox     from '@material-ui/core/Checkbox';
import { useRow }   from './RowContext';

type BaseSelectionIndicatorProps = {
    className?:     string;
    style?:         React.CSSProperties;
    children?:      never
}

export type RowSelectionIndicatorProps<T = unknown> = BaseSelectionIndicatorProps & {
    datum:          T;
}

export function RowSelectionIndicator<T = unknown>({datum, className, style}: RowSelectionIndicatorProps<T>) {
    const { setSelected, getSelected } = useRow();

    const handleCheckboxChange = React.useCallback(
        (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setSelected(datum!, checked),
        [datum, setSelected]
    );

    return (
        <Checkbox
            size="small"
            className={className}
            style={style}
            onChange={handleCheckboxChange}
            checked={getSelected(datum)}
            color="secondary"
        />
    )
}

export type MasterSelectionIndicatorProps<T = unknown> = BaseSelectionIndicatorProps & {
    data: T[];
}

export function MasterSelectionIndicator<T = unknown>({data, className, style}: MasterSelectionIndicatorProps<T>) {
    const { setSelected, countSelected }    = useRow();
    const {selected, unselected}            = countSelected(data);

    const handleMasterChange = React.useCallback(
        (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setSelected(data!, checked),
        [data]
    );

    return (
        <Checkbox
            size="small"
            className={className}
            style={style}
            onChange={handleMasterChange}
            checked={selected > 0 && unselected === 0}
            indeterminate={selected > 0 && unselected > 0}
            color="secondary"
        />
    )
}

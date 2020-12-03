import React                        from 'react';
import isArray                      from 'lodash/isArray';
import { useDerivedValue }          from '@technobuddha/react-hooks';
import { OnSelectionChangedParams } from './DataGrid';
import { useGrid }                  from './GridContext';

type RowState<T = unknown> = {
    selectedCount:      number;
    unselectedCount:    number;
    setSelected:        (datum: T, selected: boolean) => void;
    getSelected:        (datum: T) => boolean;
    countSelected:      (data: T[]) => {selected: number, unselected: number}
}

type RowProperties = {
    selected:   boolean;
}

const RowContext = React.createContext<RowState<any>>(null!);
export function useRow<T = unknown>() {
   return React.useContext(RowContext) as RowState<T>;
}

type RowProviderProps<T = unknown> = {
    selected?:              (datum: T) => boolean;
    onSelectionChanged?:    (params: OnSelectionChangedParams<T>) => void;
    children?:              React.ReactNode;
}

function defaultRowProperties(selected = false) {
    return {selected};
}

export function RowProvider<T = unknown>({selected, onSelectionChanged, children}: RowProviderProps<T>) {
    const { data }          = useGrid<T>();
    const [, forceUpdate]   = React.useReducer(x => x + 1, 0);

    const state = useDerivedValue(
        () => {
            let   selectedCount   = 0;
            const map             = new Map<T, RowProperties>();
    
            data.forEach(
                datum => {
                    const datumSelected = !!selected?.(datum);
                    if(datumSelected) ++selectedCount;
                    map.set(datum, defaultRowProperties(datumSelected));
                }
            );
    
            console.log('Row Provider initialized with ', selectedCount, data.length)

            return {map, selectedCount, unselectedCount: data.length - selectedCount, now: Date.now() };
        },
        [data, selected]
    );

    const getSelected = React.useCallback(
        (datum: T) => {
            const current = state.map.get(datum);
            if(current)
                return current.selected;
            console.error('Attempt to get selected state for row not in dataset', datum);
            return false;
        },
        [state]
    )

    const setDatumSelected = React.useCallback(
        (datum: T, selected: boolean) => {
            const current = state.map.get(datum);
            if(current) {
                if(current.selected !== selected) {
                    current.selected = selected;
                    if(selected) {
                        state.selectedCount++;
                        state.unselectedCount--;
                        forceUpdate();
                    } else {
                        state.selectedCount--;
                        state.unselectedCount++;
                        forceUpdate();
                    }
                }
            } else {
                console.error('Attempt to set selected state for row not in dataset', datum);
            }
        },
        [state]
    );

    const setSelected = React.useCallback(
        (row: T | T[], selected: boolean) => {
            if(isArray(row)) 
                row.forEach(datum => setDatumSelected(datum, selected));
            else
                setDatumSelected(row, selected);
        },
        [setDatumSelected]
    );

    const countSelected = React.useCallback(
        (data: T[]) => {
            let selected    = 0;
            let unselected  = 0;
            data.forEach(datum => {
                const datumState = state.map.get(datum);
                if(datumState) {
                    if(datumState.selected) selected++; else unselected++;
                } else {
                    console.error('Row is not in the WeakMap');
                }
            });

            return {selected, unselected};
        },
        [state]
    )

    React.useEffect(
        () => {
            onSelectionChanged?.({
                selectedRows:   data.filter(datum => getSelected(datum)),
                selectedCount:  state.selectedCount,
                unselectedCount: state.unselectedCount
            });
        },
        [state, state.selectedCount, state.unselectedCount]
    );
    
    return (
        <RowContext.Provider value={{selectedCount: state.selectedCount, unselectedCount: state.unselectedCount, getSelected, setSelected, countSelected} as RowState<T>}>
            {children}
        </RowContext.Provider>
    )
}

export default useRow;
import React                    from 'react';
import Box                      from '@material-ui/core/Box';
import Button                   from '@material-ui/core/Button';
import Dialog                   from '@material-ui/core/Dialog';
import DialogActions            from '@material-ui/core/DialogActions';
import DialogContent            from '@material-ui/core/DialogContent';
import DialogTitle              from '@material-ui/core/DialogTitle';
import toString                 from 'lodash/toString';
import DataGrid                 from '../DataGrid';
import useGrid                  from '../GridContext';
import FilterActuator           from './FilterActuator';
import { normalizeFilterArray } from './normalization';
import { equalityExecute }      from './execution';
import { arrayIndicator }       from './indicators';
import { getUniqueValues }      from './util';

import type { AnalyzerResults }             from '../analyzer';
import type { OnSelectionChangedParams }    from '../DataGrid';
import type { Filter, FilterActuatorProps } from '../filter';

export type FilterFactoryCheckboxOptions<T = unknown> = {
    type:           'checkbox-list';
    name:           keyof T;
    title?:         string;
    Icon?:          React.ComponentType<{className?: string; style?: React.CSSProperties}>;
};

export function filterCompilerCheckbox<T = unknown>({ name, title, Icon }: FilterFactoryCheckboxOptions<T>, data: T[], { getShape }: AnalyzerResults<T>): Filter<T> {
    const search = getUniqueValues(data, name);

    return {
        name,
        Actuator({ classes, styles }: FilterActuatorProps) {
            const { changeFilter, filterValues }    = useGrid<T>();
            const [ open,     setOpen ]             = React.useState<boolean>(false);
            const [ disabled, setDisabled ]         = React.useState<boolean>(true);
            const filterValue                       = React.useRef(normalizeFilterArray(filterValues[name]));

            const handleActuatorClick       = () => { setOpen(true); };
            const handleDialogClose         = () => { setOpen(false); };
            const handleSelectionChanged    = (
                { selectedRows, selectedCount, unselectedCount }: OnSelectionChangedParams<string>) => {
                filterValue.current = unselectedCount === 0 ? null : selectedRows;
                setDisabled(selectedCount === 0);
            };
            const handleOKClick             = () => { setOpen(false); changeFilter(name, filterValue.current); };
            const handleCancelClick         = () => { setOpen(false); };

            return (
                <>
                    <FilterActuator
                        classes={classes}
                        styles={styles}
                        Icon={Icon}
                        title={title ?? (name as string)}
                        onButtonClick={handleActuatorClick}
                    />
                    <Dialog
                        open={open}
                        onClose={handleDialogClose}
                        maxWidth={false}
                    >
                        <DialogTitle>{title || name}</DialogTitle>
                        <DialogContent>
                            <Box width={640} height={480}>
                                <DataGrid
                                    data={search}
                                    selection={true}
                                    selected={(datum: string) => filterValue.current === null || filterValue.current.includes(toString(datum))}
                                    columns={[{ name: name as string }]}
                                    filters={[{ type: 'search', name: 0, title: title ?? (name as string) }]}
                                    defaultSort="*"
                                    onSelectionChanged={handleSelectionChanged}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleOKClick}
                                disabled={disabled}
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            );
        },
        Indicator: arrayIndicator({ name, title, Icon }),
        execute: equalityExecute(name, getShape()),
    };
}

export default filterCompilerCheckbox;

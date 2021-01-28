import React                            from 'react';
import Button                           from '@material-ui/core/Button';
import Dialog                           from '@material-ui/core/Dialog';
import DialogActions                    from '@material-ui/core/DialogActions';
import DialogContent                    from '@material-ui/core/DialogContent';
import DialogTitle                      from '@material-ui/core/DialogTitle';
import Transfer                         from '../../../Transfer';
import { useGrid }                      from '../../GridContext';
import { equalityExecute }              from './execution';
import FilterActuator                   from '../FilterActuator';
import { arrayIndicator }               from '../indicators';
import { normalizeFilterArray }         from './normalization';
import { getUniqueValues }              from '../util';

import type { AnalyzerResults }             from '../../analyzer';
import type { Filter, FilterActuatorProps } from '../../filter';
import type { CompilerOptions } from './options';

export type TransferCompilerOptions<T = unknown> = CompilerOptions & {
    type:           'transfer';
    name:           keyof T;
    title?:         string;
    Icon?:          React.ComponentType<{className?: string; style?: React.CSSProperties}>;
};

function not<T>(a: T[], b: T[]) {
    return a.filter(value => b.indexOf(value) === -1);
}

// TODO implement the clear functionality
export function filterCompilerTransfer<T = unknown>({ name, title, Icon }: TransferCompilerOptions<T>, { getShape }: AnalyzerResults<T>): Filter<T> {
    return {
        name,
        Actuator({ classes, styles }: FilterActuatorProps) {
            const { data, changeFilter, filterValues }  = useGrid<T>();
            const [ open, setOpen ]     = React.useState<boolean>(false);
            const filterValue           = React.useMemo(() => normalizeFilterArray(filterValues[name]) ?? [], [filterValues, name]);
            const search                = React.useMemo(() => getUniqueValues(data, name),                    [data, name]);
            const left                  = React.useMemo(() => not(search, filterValue),                       [search, filterValue]);
            const right                 = React.useMemo(() => filterValue,                                    [filterValue]);
            const transfer              = React.useMemo(() => ({ left, right }),                                [left, right]);
            const handleActuatorClick   = () => { setOpen(true); };
            const handleDialogClose     = () => { setOpen(false); };
            const handleOKClick         = () => { setOpen(false); changeFilter(name, transfer.right); };
            const handleCancelClick     = () => { setOpen(false); };
            const handleTransfer        = (leftItems: string[], rightItems: string[]) => {
                transfer.left   = leftItems;
                transfer.right  = rightItems;
            };

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
                        <DialogTitle>{title ?? name}</DialogTitle>
                        <DialogContent>
                            <Transfer
                                name={name as string}
                                title={title}
                                rowHeight={24}
                                left={left}
                                right={right}
                                onTransfer={handleTransfer}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleOKClick}
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

export default filterCompilerTransfer;

import React                            from 'react';
import { useDerivedValue }              from '@technobuddha/react-hooks';
import Dialog                           from '@material-ui/core/Dialog';
import DialogTitle                      from '@material-ui/core/DialogTitle';
import DialogActions                    from '@material-ui/core/DialogActions';
import DialogContent                    from '@material-ui/core/DialogContent';
import Button                           from '@material-ui/core/Button';
import Transfer                         from '../../Transfer';
import { useGrid }                      from '../GridContext';
import { AnalyzerResults }              from '../analyzer';
import { Filter, FilterActuatorProps }  from '../filter';
import FilterActuator                   from './FilterActuator';
import { getUniqueValues }              from './util';
import { normalizeFilterArray }         from './normalization';
import { equalityExecute }              from './execution';
import { arrayIndicator }               from './indicators';

export type FilterFactoryTransferOptions = {
    type:           'transfer';
    name:           string;
    title?:         string;
    Icon?:          React.ComponentType<{className?: string; style?: React.CSSProperties;}>;
};

function not<T>(a: T[], b: T[]) {
    return a.filter(value => b.indexOf(value) === -1);
}

export function filterCompilerTransfer<T = unknown>({name, title, Icon}: FilterFactoryTransferOptions, { getShape }: AnalyzerResults<T>): Filter<T> {
    return {
        name,
        Actuator({classes, styles}: FilterActuatorProps) {
            const { data, changeFilter, filterValues }  = useGrid<T>();
            const [ open, setOpen ]     = React.useState<boolean>(false);
            const filterValue           = useDerivedValue(() => normalizeFilterArray(filterValues[name]) ?? [], [filterValues, name]);
            const search                = useDerivedValue(() => getUniqueValues(data, name),                    [data, name]);
            const left                  = useDerivedValue(() => not(search, filterValue),                       [search, filterValue]);
            const right                 = useDerivedValue(() => filterValue,                                    [filterValue]);
            const transfer              = useDerivedValue(() => ({left, right}),                                [left, right])
            const handleActuatorClick   = () => { setOpen(true); }
            const handleDialogClose     = () => { setOpen(false); }
            const handleOKClick         = () => { setOpen(false); changeFilter(name, transfer.right); }
            const handleCancelClick     = () => { setOpen(false); }
            const handleTransfer        = (left: string[], right: string[]) => {
                transfer.left   = left;
                transfer.right  = right;
            };

            return (
                <>
                    <FilterActuator
                        classes={classes}
                        styles={styles}
                        Icon={Icon}
                        title={title ?? name}
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
                                name={name}
                                title={title}
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
            )
        },
        Indicator: arrayIndicator({name, title, Icon}),
        execute: equalityExecute(name, getShape()),
    }
}

export default filterCompilerTransfer;

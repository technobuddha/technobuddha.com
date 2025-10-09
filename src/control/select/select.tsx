/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
  type SelectProps as MuiSelectProps,
} from '@mui/material';

import css from './select.module.css' with { type: 'css' };

type SelectBase<T extends string | number> = {
  readonly label?: MuiSelectProps<T>['label'];
  readonly disabled?: MuiSelectProps<T>['disabled'];

  readonly children?: MuiSelectProps<T>['children'];
};

type SelectDefined<T extends string | number> = {
  readonly value: T;

  onChange?(this: void, value: T): void;
};

type SelectUndefined<T extends string | number> = {
  readonly value: T | undefined;
  readonly allowUndefined?: true | string;

  onChange?(this: void, value: T | undefined): void;
};

export type SelectProps<T extends string | number = string> = SelectBase<T> &
  (SelectDefined<T> | SelectUndefined<T>);

export function Select<T extends string | number = string>(props: SelectProps<T>): React.ReactNode {
  const labelId = React.useId();
  const selectId = React.useId();

  const { label, disabled, children } = props;

  const undefinedText = React.useMemo(
    () =>
      'allowUndefined' in props ?
        props.allowUndefined === true ?
          '(undefined)'
        : props.allowUndefined
      : undefined,
    [props],
  );

  const value = React.useMemo(() => props.value ?? undefinedText ?? '', [props, undefinedText]);

  const handleChange = React.useCallback(
    (event: SelectChangeEvent<T>) => {
      const v = event.target.value as T;

      if ('allowUndefined' in props) {
        if (v === undefinedText) {
          props.onChange?.(undefined);
        } else {
          props.onChange?.(v);
        }
      } else {
        props.onChange?.(v);
      }
    },
    [undefinedText, props],
  );

  return (
    <FormControl margin="normal" size="small" fullWidth classes={{ root: css.formControl }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect<T>
        id={selectId}
        labelId={labelId}
        label={label}
        disabled={disabled}
        value={value as T}
        onChange={handleChange}
        inputProps={{
          name: selectId,
          id: selectId,
        }}
        classes={{ root: css.select }}
      >
        {Boolean(undefinedText) && <MenuItem value={undefinedText}>{undefinedText}</MenuItem>}
        {children}
      </MuiSelect>
    </FormControl>
  );
}

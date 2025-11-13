import React from 'react';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { MdCancel, MdSearch } from 'react-icons/md';

import { TextField } from '../text-field/index.ts';

import css from './search-input.module.css' with { type: 'css' };

export type SearchInputProps = {
  readonly className?: string;
  readonly label?: string;
  readonly helperText?: string;
  onChange?(this: void, text: string): void;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  className,
  label,
  helperText,
  onChange,
}) => {
  const id = React.useId();
  const [search, setSearch] = React.useState<string>('');

  const handleChange = React.useCallback(
    (text: string) => {
      setSearch(text);
      onChange?.(text);
    },
    [onChange],
  );

  const handleCancel = React.useCallback(() => {
    setSearch('');
  }, []);

  return (
    <TextField
      className={clsx(css.search, className)}
      onChange={handleChange}
      id={id}
      label={label}
      value={search}
      helperText={helperText}
      startAdornment={<MdSearch />}
      endAdornment={
        <IconButton onClick={handleCancel} tabIndex={-1}>
          <MdCancel />
        </IconButton>
      }
    />
  );
};

import React            from 'react';
import clsx       from 'clsx';
import uuid             from 'uuid';
import TextField        from '~src/client/control/textField/TextField';
import IconButton       from '@material-ui/core/IconButton';
import Search           from '@material-ui/icons/Search';
import Cancel           from '@material-ui/icons/Cancel';
import css              from './SearchInput.module.css';

type SearchInputProps =
    {
        className?:     string;
        label?:         string;
        helperText?:    string;
        onChange?:      (text: string) => void;
    };

export const SearchInput: React.FC<SearchInputProps> = (props: SearchInputProps) => {
    const [ search, setSearch ] = React.useState<string>('');
    const [ id ]                = React.useState<string>(uuid.v4);

    const handleChange = (text: string) => { setSearch(text); props.onChange?.(text); };
    const handleCancel = () => { setSearch(''); };

    return (
        <TextField
            className={clsx(css.search, props.className)}
            onChange={handleChange}
            id={id}
            label={props.label}
            value={search}
            helperText={props.helperText}
            startAdornment={<Search />}
            endAdornment={(
                <IconButton onClick={handleCancel} tabIndex={-1}>
                    <Cancel />
                </IconButton>
            )}
        />
    );
};

export default SearchInput;

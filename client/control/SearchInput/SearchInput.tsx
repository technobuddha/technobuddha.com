import React            from 'react';
import clsx       from 'clsx';
import uuid             from 'uuid';
import TextField        from '$client/control/TextField';
import IconButton       from '$client/control/IconButton';
import Search           from '@material-ui/icons/Search';
import Cancel           from '@material-ui/icons/Cancel';
import css              from './SearchInput.pcss';

type SearchInputProps =
    {
        className?:     string;
        label?:         string;
        helperText?:    string;
        onChange?:      (text: string) => void;
    };

export const SearchInput: React.FC<SearchInputProps> = (props: SearchInputProps) => {
    const [ search, setSearch ] = React.useState<string>('');
    const [ id ]                = React.useState<string>(uuid.v4)

    const handleChange = (text: string) => { setSearch(text); props.onChange?.(text); }
    const handleCancel = () => { setSearch('') }

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
}

export default SearchInput;

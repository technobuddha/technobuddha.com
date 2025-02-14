import React            from 'react';
import clsx             from 'clsx';
import uuid             from 'uuid';
import TextField        from '#control/textField';
import IconButton       from '@material-ui/core/IconButton';
import { MdSearch }     from '%icons/md/MdSearch';
import { MdCancel }     from '%icons/md/MdCancel';
import css              from './SearchInput.css';

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
            startAdornment={<MdSearch />}
            endAdornment={(
                <IconButton onClick={handleCancel} tabIndex={-1}>
                    <MdCancel />
                </IconButton>
            )}
        />
    );
};

export default SearchInput;

import React from 'react';
import TextField, { TextFieldProps }    from '@material-ui/core/TextField';

type NumberFieldProps = TextFieldProps & {
    id?:    string;
    name?:  string;
    min?:   number;
    max?:   number;
}

export const NumberField: React.FC<NumberFieldProps> = (props: NumberFieldProps) => {
    const {id, name, min, max, children, ...rest} = props;
    return <TextField {...rest} inputProps={{id, name, min, max}}>{children}</TextField>
}
import React                                      from 'react';
import MuiButton, {ButtonProps as MuiButtonProps} from '@material-ui/core/Button';

type ButtonProps = Omit<MuiButtonProps, 'color'>;

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <MuiButton {...props} color="secondary"/>
    );
}

export default Button;

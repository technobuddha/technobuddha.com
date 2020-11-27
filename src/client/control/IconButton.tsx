import React                                                    from 'react';
import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from '@material-ui/core/IconButton';

export type IconButtonProps = Omit<MuiIconButtonProps, 'onClick'> & { onClick?: () => void };

export const IconButton: React.FC<IconButtonProps> = (props: IconButtonProps) => {
    const { onClick, ...muiProps } = props;

    const handleClick = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick?.();

    return <MuiIconButton onClick={handleClick} {...muiProps} />
}

export default IconButton;

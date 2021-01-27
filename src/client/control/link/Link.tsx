import React      from 'react';
import MuiLink    from '@material-ui/core/Link';
import useHistory from '#context/router';

import type { AnchorHTMLAttributes }        from 'react';
import type { LinkProps as MuiLinkProps }   from '@material-ui/core/Link';
import type { LinkProps as RouterLinkProps } from 'react-router-dom';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    to:                 string;
    replace?:           RouterLinkProps['replace'];
    classes?:           MuiLinkProps['classes'];
    color?:             MuiLinkProps['color'];
    TypographyClasses?: MuiLinkProps['TypographyClasses'];
    underline?:         MuiLinkProps['underline'];
    variant?:           MuiLinkProps['variant'];
};

export const Link: React.FC<LinkProps> = (props: LinkProps) => {
    const history = useHistory();
    const { replace, to, ...myProps } = props;

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();

        if(replace) {
            history.replace(props.to);
        } else {
            history.push(props.to);
        }
    };

    return (
        <MuiLink {...myProps} href={to} onClick={handleClick} />
    );
};

export default Link;

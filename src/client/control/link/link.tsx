import React from 'react';
import MuiLink from '@mui/material/Link';
import { useNavigate } from '#context/router';

import type { AnchorHTMLAttributes } from 'react';
import type { LinkProps as MuiLinkProps } from '@mui/material/Link';
import type { LinkProps as RouterLinkProps } from 'react-router';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  replace?: RouterLinkProps['replace'];
  classes?: MuiLinkProps['classes'];
  color?: MuiLinkProps['color'];
  TypographyClasses?: MuiLinkProps['TypographyClasses'];
  underline?: MuiLinkProps['underline'];
  variant?: MuiLinkProps['variant'];
};

export const Link: React.FC<LinkProps> = ({ replace, to, ...myProps }: LinkProps) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();

    if (replace) navigate(to, { replace: true });
    else navigate(to);
  };

  return <MuiLink {...myProps} href={to} onClick={handleClick} />;
};

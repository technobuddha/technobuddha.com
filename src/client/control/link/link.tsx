import React from 'react';
import { type AnchorHTMLAttributes } from 'react';
import { type LinkProps as MuiLinkProps } from '@mui/material/Link';
import MuiLink from '@mui/material/Link';
import { type LinkProps as RouterLinkProps } from 'react-router';

import { useNavigate } from '#context/router';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  readonly to: string;
  readonly replace?: RouterLinkProps['replace'];
  readonly classes?: MuiLinkProps['classes'];
  readonly color?: MuiLinkProps['color'];
  readonly typographyClasses?: MuiLinkProps['TypographyClasses'];
  readonly underline?: MuiLinkProps['underline'];
  readonly variant?: MuiLinkProps['variant'];
};

export const Link: React.FC<LinkProps> = ({ replace, to, ...myProps }: LinkProps) => {
  const navigate = useNavigate();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>): void => {
      event.preventDefault();

      if (replace) {
        void navigate(to, { replace: true });
      } else {
        void navigate(to);
      }
    },
    [navigate, replace, to],
  );

  return <MuiLink {...myProps} href={to} onClick={handleClick} />;
};

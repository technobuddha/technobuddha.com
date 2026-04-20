import React from 'react';

import { useLocation } from '#context/router';

type UseUserInterface = {
  footer: React.ReactNode;
  setFooter(this: void, footer: React.ReactNode): void;
};

const UserInterfaceContext = React.createContext<UseUserInterface>({
  footer: null,
  setFooter: () => {},
});

export function useUserInterface(): UseUserInterface {
  return React.use(UserInterfaceContext);
}

type UserInterfaceProviderProps = {
  readonly children?: React.ReactNode;
};

export const UserInterfaceProvider: React.FC<UserInterfaceProviderProps> = ({ children }) => {
  const location = useLocation();
  const [footer, setFooter] = React.useState<React.ReactNode>(null);

  React.useLayoutEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setFooter(null);
  }, [location]);

  const value = React.useMemo<UseUserInterface>(
    () => ({
      footer,
      setFooter,
    }),
    [footer, setFooter],
  );

  return <UserInterfaceContext value={value}>{children}</UserInterfaceContext>;
};

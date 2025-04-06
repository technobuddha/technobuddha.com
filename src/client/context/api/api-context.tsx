import React from 'react';

import {
  checkPasswordStrength,
  createAccount,
  createSession,
  deleteSession,
  readSession,
} from './server-call/authentication.ts';
import { artists, genres, newAlbums, tracks } from './server-call/music.ts';

export type API = {
  readonly authentication: {
    readonly readSession: typeof readSession;
    readonly createSession: typeof createSession;
    readonly deleteSession: typeof deleteSession;
    readonly checkPasswordStrength: typeof checkPasswordStrength;
    readonly createAccount: typeof createAccount;
  };

  readonly music: {
    readonly tracks: typeof tracks;
    readonly newAlbums: typeof newAlbums;
    readonly artists: typeof artists;
    readonly genres: typeof genres;
  };
};

const APIContext = React.createContext<API>(null!);
export function useAPI(): API {
  return React.useContext(APIContext);
}

type APIProviderProps = {
  readonly children?: React.ReactNode;
};

export const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
  const value = React.useMemo<API>(
    () => ({
      authentication: {
        readSession,
        createSession,
        deleteSession,
        checkPasswordStrength,
        createAccount,
      },
      music: {
        tracks,
        newAlbums,
        artists,
        genres,
      },
    }),
    [],
  );

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

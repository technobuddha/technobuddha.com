import React                        from 'react';
import fetchAPI                     from './fetchAPI';
import authentication               from './serverCall/authentication';
import music                        from './serverCall/music';

type APIState   = {
    fetchAPI:       typeof fetchAPI;
    authentication: typeof authentication;
    music:          typeof music;
};

const APIContext = React.createContext<APIState>(null!);
export function useAPI() {
    return React.useContext(APIContext);
}

export const APIProvider: React.FC = (props: { children?: React.ReactNode }) => {
    return (
        <APIContext.Provider value={{ fetchAPI, authentication, music }}>
            {props.children}
        </APIContext.Provider>
    );
};

export default useAPI;

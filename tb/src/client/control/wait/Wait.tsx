import React             from 'react';
import css               from './Wait.css';

type WaitProps = {
    children?: never;
};

export const Wait: React.FC<WaitProps> = () => {
    return (
        <div className={css.root} />
    );
};

export default Wait;

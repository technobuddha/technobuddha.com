import React  from 'react';
import clsx   from 'clsx';
import css    from './Failure.css';

type FailureProps = {
    message?: string;
    description?: string;
    animated?: boolean;
    children?: never;
};

export const Failure: React.FC<FailureProps> = ({ message, description, animated }) => {
    if(animated === undefined)
        animated = true;

    return (
        <>
            <div className={clsx(css.icon, animated && css.animated)} />
            {
                message && <div className={css.message}>{message}</div>
            }
            {
                message && <div className={css.description}>{description}</div>
            }
        </>
    );
};

export default Failure;

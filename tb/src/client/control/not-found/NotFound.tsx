import React  from 'react';
import clsx   from 'clsx';
import Link   from '#control/link';
import css    from './NotFound.css';

type NotFoundProps = {
    animated?: boolean;
    message?: string;
    children?: never;
};

export const NotFound: React.FC<NotFoundProps> = ({ animated = false, message = 'The requested page can not be found.' }) => {
    return (
        <>
            <div className={clsx(css.icon, animated && css.animated)} />
            <div className={css.message}>{message}</div>
            <div className={css.status}>Return to <Link to="/home">Home</Link></div>
        </>
    );
};

export default NotFound;

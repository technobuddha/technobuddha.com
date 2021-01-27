import React, { Suspense } from 'react';
import DelayedLoading      from '#control/delayedLoading';

const LazyChaos = React.lazy(() => import(
    /* webpackMode:      "lazy"  */
    /* webpackChunkName: "chaos" */
    './Chaos'
));

export const Chaos = () => {
    return (
        <Suspense fallback={<DelayedLoading />}>
            <LazyChaos />
        </Suspense>
    );
};

export default Chaos;

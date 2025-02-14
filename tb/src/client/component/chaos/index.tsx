import React, { Suspense } from 'react';
import DelayedLoading      from '#control/delayedLoading';

const LazyChaos = React.lazy(async () => import(
    /* webpackChunkName: "chaos" */
    './Chaos'
));

export const Chaos: React.FC = () => {
    return (
        <Suspense fallback={<DelayedLoading />}>
            <LazyChaos />
        </Suspense>
    );
};

export default Chaos;

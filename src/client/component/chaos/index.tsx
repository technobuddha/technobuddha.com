import React, { Suspense } from 'react';
import DelayedLoading      from '#control/delayedLoading';

const LazyChaos = React.lazy(() => new Promise<any>(resolve => {
    setTimeout(
        async () => resolve(
            await import(
                /* webpackMode:      "lazy"  */
                /* webpackChunkName: "chaos" */
                './Chaos'
            )
        ),
        15000
    )
}));

export const Chaos = () => {
    return (
        <Suspense fallback={<DelayedLoading />}>
            <LazyChaos />
        </Suspense>
    )
}

export default Chaos;

import type React from 'react';

export type CompilerOptions = {
    clear?:     React.MutableRefObject<() => void>;
};

export default CompilerOptions;

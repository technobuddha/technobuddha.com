import React from 'react';
import css   from './ColorSpace.css';
import Slider from '@material-ui/core/Slider';
import { toRGB }  from '@technobuddha/color';
import type { RGB } from '@technobuddha/color';

type ColorSpaceProps<T extends string> = {
    colorSpace: Record<T, Attributes>;
    color: Record<T, number>;
    onChange?: (color: RGB) => void;
    children?: never;
};

type Attributes = {
    min: number;
    max: number;
};

export function ColorSpace<T extends string>({ colorSpace, color, onChange }: ColorSpaceProps<T>): React.ReactElement {
    const handleChange = (key: T) =>
        (_: React.ChangeEvent<{}>, value: number | number[] | undefined) => {
            onChange?.(toRGB({ ...color, [key]: value as number } as any));
        };

    return (
        <div className={css.colorSpace}>
            {
                Object.entries<Attributes>(colorSpace).map(
                    ([ key, attributes ], i) => {
                        return (
                            <Slider
                                key={i}
                                value={color[key as T]}
                                onChange={handleChange(key as T)}
                                min={attributes.min}
                                max={attributes.max}
                            />
                        );
                    }
                )
            }
        </div>
    );
}

export default ColorSpace;

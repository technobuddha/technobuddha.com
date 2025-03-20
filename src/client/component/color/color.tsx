import React from 'react';
import { type ColorSpecification } from '@technobuddha/color';
import { toLAB } from '@technobuddha/color';

import { ColorSpace } from './color-space.tsx';

import css from './color.module.css';

type ColorProps = {
  children?: never;
};

export const Color: React.FC<ColorProps> = () => {
  const [rgb, setRGB] = React.useState<ColorSpecification>({ r: 27, g: 108, b: 168 });

  // const hsl = color.toHSL(rgb);
  // const hsv = color.toHSV(rgb);
  // const hwb = color.toHWB(rgb);
  // const hcg = color.toHCG(rgb);
  // const cmyk = color.toCMYK(rgb);
  // const xyz = color.toXYZ(rgb);
  const lab = toLAB(rgb);

  const handleChange = React.useCallback((c: ColorSpecification): void => {
    setRGB(c);
  }, []);

  return (
    <div className={css.color}>
      {/* <div className={css.swatch} style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }} />
            <ColorSpace
                color={{ r: rgb.r, g: rgb.g, b: rgb.b }}
                colorSpace={{
                    r: { min: 0, max: 255 },
                    g: { min: 0, max: 255 },
                    b: { min: 0, max: 266 },
                }}
                onChange={handleChange}
            />
            <ColorSpace
                color={{ h: hsl.h, s: hsl.s, l: hsl.l }}
                colorSpace={{
                    h: { min: 0, max: 359 },
                    s: { min: 0, max: 100 },
                    l: { min: 0, max: 100 },
                }}
                onChange={handleChange}
            />
            <ColorSpace
                color={{ h: hsv.h, s: hsv.s, v: hsv.v }}
                colorSpace={{
                    h: { min: 0, max: 359 },
                    s: { min: 0, max: 100 },
                    v: { min: 0, max: 100 },
                }}
                onChange={handleChange}
            />
            <ColorSpace
                color={{ h: hwb.h, w: hwb.w, b: hwb.b }}
                colorSpace={{
                    h: { min: 0, max: 359 },
                    w: { min: 0, max: 100 },
                    b: { min: 0, max: 100 },
                }}
                onChange={handleChange}
            />
            <ColorSpace
                color={{ h: hcg.h, c: hcg.c, g: hcg.g }}
                colorSpace={{
                    h: { min: 0, max: 359 },
                    c: { min: 0, max: 100 },
                    g: { min: 0, max: 100 },
                }}
                onChange={handleChange}
            />
            <ColorSpace
                color={{ c: cmyk.c, m: cmyk.m, y: cmyk.y, k: cmyk.k }}
                colorSpace={{
                    c: { min: 0, max: 100 },
                    m: { min: 0, max: 100 },
                    y: { min: 0, max: 100 },
                    k: { min: 0, max: 100 },
                }}
                onChange={handleChange}
            /> */}
      {/* <ColorSpace
                color={{ x: xyz.x, y: xyz.y, z: xyz.z }}
                colorSpace={{
                    x: { min: 0, max: 94.7 },
                    y: { min: 0, max: 100 },
                    z: { min: 0, max: 108.8 },
                }}
                onChange={handleChange}
            /> */}
      <ColorSpace
        color={{ l: lab.l, a: lab.a, b: lab.b }}
        colorSpace={{
          l: { min: 0, max: 100 },
          a: { min: -128, max: 128 },
          b: { min: -128, max: 128 },
        }}
        onChange={handleChange}
      />
    </div>
  );
};

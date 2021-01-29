import color from '@technobuddha/library/color';
import lerp  from '@technobuddha/library/lerp';

export type MandelbrotReturn = { colors: RGBV[][]; x_min: number; x_max: number; y_min: number; y_max: number };
export type RGBV = { r: number; g: number; b: number };

function mandelbrot(width: number, height: number, x_min: number, x_max: number, y_min: number, y_max: number, iterations: number): MandelbrotReturn {
    const counts: number[][] = [];
    const histo = new Array(iterations).fill(0);

    const desired_width  = x_max - x_min;
    const desired_height = y_max - y_min;
    const ratio          = ((width / height) / (desired_width / desired_height));

    if(ratio < 1) {
        const center = y_min + desired_height / 2;
        y_min        = center - (desired_height / 2) / ratio;
        y_max        = center + (desired_height / 2) / ratio;
    } else {
        const center = x_min + desired_width / 2;
        x_min        = center - (desired_width / 2) * ratio;
        x_max        = center + (desired_width / 2) * ratio;
    }

    for(let i = 0; i < width; ++i) {
        counts[i] = [];

        for(let j = 0; j < height; ++j) {
            const x0        = i * ((x_max - x_min) / width)  + x_min;
            const y0        = j * ((y_max - y_min) / height) + y_min;
            let x           = 0.0;
            let y           = 0.0;
            let iteration   = 0;

            while(x * x + y * y <= 4 && iteration < iterations) {
                const t = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = t;
                ++iteration;
            }

            if(iteration < iterations) {
                const logzn = Math.log(x * x + y * y) / 2;
                const nu    = Math.log(logzn / Math.LN2) / Math.LN2;

                const count  = iteration + 1 - nu;
                counts[i][j] = count;
                if(count < iterations - 1)
                    histo[Math.floor(count)]++;
            } else {
                counts[i][j] = iterations;
            }
        }
    }

    const hues = Array(iterations).fill(0);

    let total = 0;
    for(let i = 0; i < iterations; ++i)
        total += histo[i];

    let t = 0;
    for(let i = 0; i < iterations; ++i) {
        t += histo[i] / total;
        hues[i] = t;
    }

    const colors: RGBV[][] = [];
    for(let i = 0; i < width; ++i) {
        colors[i] = [];
        for(let j = 0; j < height; ++j) {
            const m = counts[i][j];
            const h = 1 - lerp(hues[Math.floor(m)], hues[Math.ceil(m)], m % 1);
            const s = 1;
            const v = m < iterations ? 1 : 0;
            const rgb = (new color.HSV(h, s, v).toRGB());

            colors[i][j] = { r: rgb.r, g: rgb.g, b: rgb.b };
        }
    }

    return { colors, x_min, x_max, y_min, y_max };
}

export const exports = {
    mandelbrot,
};

export type ChaosAPI = typeof exports;

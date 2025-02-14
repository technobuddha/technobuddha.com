import lerp  from '@technobuddha/library/lerp';

type RGB = { r: number; g: number; b: number };

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

    const hues = new Array(iterations).fill(0);

    let total = 0;
    for(let i = 0; i < iterations; ++i)
        total += histo[i];

    let h = 0;
    for(let i = 0; i < iterations; ++i) {
        h += histo[i] / total;
        hues[i] = h;
    }

    const colors: RGB[][] = [];
    for(let i = 0; i < width; ++i) {
        colors[i] = [];
        for(let j = 0; j < height; ++j) {
            const m = counts[i][j];

            let hue        = 1 - lerp(hues[Math.floor(m)], hues[Math.ceil(m)], m % 1);
            let saturation = 1;
            let value      = m < iterations ? 1 : 0;

            hue *= 6;
            let hi          = Math.floor(hue) % 6;

            const f = hue - Math.floor(hue);
            const p = value * (1 - saturation);
            const q = value * (1 - (saturation * f));
            const t = value * (1 - (saturation * (1 - f)));
            const v = value;

            let red:   number;
            let green: number;
            let blue:  number;
            switch(hi) {
                case 0:   red = v; green = t; blue = p; break;
                case 1:   red = q; green = v; blue = t; break;
                case 2:   red = p; green = v; blue = t; break;
                case 3:   red = p; green = q; blue = v; break;
                case 4:   red = t; green = p; blue = v; break;
                default:  red = v; green = p; blue = q; break;
            }

            colors[i][j] = { r: Math.round(red * 255), g: Math.round(green * 255), b: Math.round(blue * 255) };
        }
    }

    return { colors, x_min, x_max, y_min, y_max };
}

export type MandelbrotReturn = { colors: RGB[][]; x_min: number; x_max: number; y_min: number; y_max: number };
export type ChaosAPI = typeof exports;
export const exports = { mandelbrot };

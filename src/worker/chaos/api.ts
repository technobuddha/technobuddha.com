import color from '@technobuddha/library/color';

type RGBV = { r: number, g: number; b: number };


function lerp(color1: number, color2: number, t: number): number {
    return color1 * (1 - t) + color2 * t;
}

function mandelbrot(width: number, height: number, iterations: number): RGBV[][] {
    const counts: number[][] = [];
    const histo = new Array(iterations).fill(0);
    
    for(let i = 0; i < width; ++i) {
        counts[i] = [];

        for(let j = 0; j < height; ++j) {
            const x0        = i * (3.0 / width)  - 2.0;
            const y0        = j * (2.0 / height) - 1.0;
            let x           = 0.0;
            let y           = 0.0;
            let iteration   = 0;

            while(x*x + y*y <= 4 && iteration < iterations) {
                const t = x*x - y*y + x0;
                y = 2*x*y + y0;
                x = t;
                ++iteration;
            }

            if(iteration < iterations) {
                const logzn = Math.log(x*x + y*y) / 2;
                const nu    = Math.log(logzn / Math.LN2) / Math.LN2;
    
                const count  = iteration + 1 - nu;
                counts[i][j] = count;
                if(count < iterations - 1)
                    histo[Math.floor(count)]++;
            }
            else
                counts[i][j] = iterations;
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
        colors[i] = []
        for(let j = 0; j < height; ++j) {
            const m = counts[i][j];
            const h = 1 - lerp(hues[Math.floor(m)], hues[Math.ceil(m)], m % 1);
            const s = 1;
            const v = m < iterations ? 1 : 0;
            const rgb = (new color.HSV(h, s, v).toRGB())

            colors[i][j] = { r: rgb.r, g: rgb.g, b: rgb.b };
        }
    }

    return colors;
}

export const exports = {
    mandelbrot
};

export type ChaosAPI = typeof exports;

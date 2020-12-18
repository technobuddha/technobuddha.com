function mandelbrot(width: number, height: number, iterations: number): number[][] {
    const res: number[][] = [];
 
    for(let i = 0; i < width; ++i) {
        res[i] = [];

        for(let j = 0; j < height; ++j) {
            const x0        = i * (3.5 / width)  - 2.5;
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

            res[i][j] = iteration - 1;
        }
    }
    return res;
}

export const exports = {
    mandelbrot
};

export type ChaosAPI = typeof exports;

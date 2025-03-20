import { lerp } from '@technobuddha/library';

type RGB = { r: number; g: number; b: number };

function mandelbrot(
  width: number,
  height: number,
  xMinimum: number,
  xMaximum: number,
  yMinimum: number,
  yMaximum: number,
  iterations: number,
): MandelbrotReturn {
  let xMin = xMinimum;
  let xMax = xMaximum;
  let yMin = yMinimum;
  let yMax = yMaximum;

  const counts: number[][] = [];
  const histo = Array.from<number>({ length: iterations }).fill(0);

  const desiredWidth = xMax - xMin;
  const desiredHeight = yMax - yMin;
  const ratio = width / height / (desiredWidth / desiredHeight);

  if (ratio < 1) {
    const center = yMin + desiredHeight / 2;
    yMin = center - desiredHeight / 2 / ratio;
    yMax = center + desiredHeight / 2 / ratio;
  } else {
    const center = xMin + desiredWidth / 2;
    xMin = center - (desiredWidth / 2) * ratio;
    xMax = center + (desiredWidth / 2) * ratio;
  }

  for (let i = 0; i < width; ++i) {
    counts[i] = [];

    for (let j = 0; j < height; ++j) {
      const x0 = i * ((xMax - xMin) / width) + xMin;
      const y0 = j * ((yMax - yMin) / height) + yMin;
      let x = 0.0;
      let y = 0.0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < iterations) {
        const t = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = t;
        ++iteration;
      }

      if (iteration < iterations) {
        const logzn = Math.log(x * x + y * y) / 2;
        const nu = Math.log2(logzn / Math.LN2);

        const count = iteration + 1 - nu;
        counts[i][j] = count;
        if (count < iterations - 1) {
          histo[Math.floor(count)]++;
        }
      } else {
        counts[i][j] = iterations;
      }
    }
  }

  const hues = Array.from<number>({ length: iterations }).fill(0);

  let total = 0;
  for (let i = 0; i < iterations; ++i) {
    total += histo[i];
  }

  let h = 0;
  for (let i = 0; i < iterations; ++i) {
    h += histo[i] / total;
    hues[i] = h;
  }

  const colors: RGB[][] = [];
  for (let i = 0; i < width; ++i) {
    colors[i] = [];
    for (let j = 0; j < height; ++j) {
      const m = counts[i][j];

      let hue = 1 - lerp(hues[Math.floor(m)], hues[Math.ceil(m)], m % 1);
      const saturation = 1;
      const value = m < iterations ? 1 : 0;

      hue *= 6;
      const hi = Math.floor(hue) % 6;

      const f = hue - Math.floor(hue);
      const p = value * (1 - saturation);
      const q = value * (1 - saturation * f);
      const t = value * (1 - saturation * (1 - f));
      const v = value;

      let red: number;
      let green: number;
      let blue: number;
      switch (hi) {
        case 0: {
          red = v;
          green = t;
          blue = p;
          break;
        }
        case 1: {
          red = q;
          green = v;
          blue = t;
          break;
        }
        case 2: {
          red = p;
          green = v;
          blue = t;
          break;
        }
        case 3: {
          red = p;
          green = q;
          blue = v;
          break;
        }
        case 4: {
          red = t;
          green = p;
          blue = v;
          break;
        }
        default: {
          red = v;
          green = p;
          blue = q;
          break;
        }
      }

      colors[i][j] = {
        r: Math.round(red * 255),
        g: Math.round(green * 255),
        b: Math.round(blue * 255),
      };
    }
  }

  return { colors, x_min: xMin, x_max: xMax, y_min: yMin, y_max: yMax };
}

export type MandelbrotReturn = {
  colors: RGB[][];
  x_min: number;
  x_max: number;
  y_min: number;
  y_max: number;
};
export const exports = { mandelbrot };
export type ChaosAPI = typeof exports;

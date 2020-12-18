import React          from 'react';
import { Size }       from 'mui-size';
import { makeStyles } from '@material-ui/core/styles';
import {chaos}        from '#worker/chaos';

const SIZE          = 1;
const MAX_ITERATION = 32;

const useChaosStyles = makeStyles({
    canvas: {
        border: 'none',
        padding: 0,
        margin: 0,
    },
});

const palette = Array.from((function*() {
    for(let i = 0; i < MAX_ITERATION; ++i) {
        const c = Math.round(255 * (i / MAX_ITERATION));
        yield {r: c, g: c, b: c};
    }
})());

export const Chaos: React.FC = () => {
    return (
        <Size width="100%" height="100%">
            {({width, height}) => <ChaosBoard boxWidth={width} boxHeight={height} />}
        </Size>
    )
}

type ChaosBoardProps = {boxWidth: number, boxHeight: number};

const ChaosBoard: React.FC<ChaosBoardProps> = ({boxWidth, boxHeight}: ChaosBoardProps) => {
    const css                   = useChaosStyles();
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const width                 = React.useMemo(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = React.useMemo(() => Math.floor(boxHeight / SIZE), [boxHeight]);

    React.useEffect(
        () => {
            chaos.mandelbrot(width, height, MAX_ITERATION)
            .then(grid => {
                const context   = canvas.current!.getContext('2d')!;
                context.translate(0.5, 0.5);
                const imageData = context.getImageData(0, 0, canvas.current!.width, canvas.current!.height);

                const setPixel = (x: number, y: number, r: number, g: number, b: number) => {
                    const offset = (x * 4) + (y * imageData.width * 4);
                    imageData.data[offset + 0] = r;
                    imageData.data[offset + 1] = g;
                    imageData.data[offset + 2] = b;
                    imageData.data[offset + 3] = 255;
                }
                
                for(let i = 0; i < width; ++i) {
                    for(let j = 0; j < height; ++j) {
                        const iteration = grid[i][j];

                        setPixel(i, j, palette[iteration].r, palette[iteration].g, palette[iteration].b)
                    }
                }

                context.putImageData(imageData, 0, 0);
            })
            .catch(err => console.error(err))
        },
        [width, height]
    )

    return (
        <div style={{width: boxWidth, height: height, position: 'relative'}}>
            <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight}>
            </canvas>
        </div>
    );
}

export default Chaos;
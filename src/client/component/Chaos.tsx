import React                                from 'react';
//import clsx                                 from 'clsx';
//import { create2DArray }                    from '@technobuddha/library/create2DArray';
import { useDerivedValue } from '@technobuddha/react-hooks';
import { Size }                             from 'mui-size';
import { makeStyles }                       from '@material-ui/core/styles';
import {pool}                               from 'workerpool';

const SIZE          = 1;
const MAX_ITERATION = 10240;

const useChaosStyles = makeStyles(_theme => ({
    canvas: {
        //border: `1px solid ${theme.palette.primary.main}`,
        border: 'none',
        padding: 0,
        margin: 0,
    },
}));

const quarter = MAX_ITERATION / 4;
const palette = Array.from((function*() {
    for(let i = 0; i < 1 * quarter; ++i) {
        const c = Math.round(255 * (i / quarter));
        yield {r: c, g: 0, b: 0};
    }

    for(let i = 0; i < 1 * quarter; ++i) {
        const c = Math.round(255 * (i / quarter));
        yield {r: 0, g: c, b: 0};
    }

    for(let i = 0; i < 1 * quarter; ++i) {
        const c = Math.round(255 * (i / quarter));
        yield {r: 0, g: 0, b: c};
    }

    for(let i = 0; i < 1 * quarter; ++i) {
        const c = Math.round(255 * (i / quarter));
        yield {r: 255, g: 255, b: c};
    }
})() )

console.log(palette);

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
    const width                 = useDerivedValue(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = useDerivedValue(() => Math.floor(boxHeight / SIZE), [boxHeight]);

    React.useEffect(
        () => {
            // This function is serialized and send to the pool, so can't reference anything in scope
            const p = pool();

            p.exec(
                (width: number, height: number, iterations: number) => {
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

                            res[i][j] = iteration;
                        }
                    }
                    return res;
                },
                [width, height, MAX_ITERATION]
            )
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

                        setPixel(i, j, iteration == MAX_ITERATION ? 255 : 0, iteration == MAX_ITERATION ? 255 : 0, iteration == MAX_ITERATION ? 255 : 0)
                    }
                }

                context.putImageData(imageData, 0, 0);
            })
            .catch(err => console.error(err))
            .always(p.terminate);
        },
        [width, height]
    )

    return (
        <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight}>
        </canvas>
    );
}

export default Chaos;
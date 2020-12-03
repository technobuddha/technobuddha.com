import React                                from 'react';
//import clsx                                 from 'clsx';
//import { create2DArray }                    from '@technobuddha/library/create2DArray';
import { useDerivedValue } from '@technobuddha/react-hooks';
import { Size }                             from 'mui-size';
import { makeStyles }                       from '@material-ui/core/styles';
import { BigFloat32 } from 'bigfloat';

const SIZE  = 160;

const useChaosStyles = makeStyles(theme => ({
    canvas: {
        border: `1px solid ${theme.palette.primary.main}`,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
}));

export const Chaos: React.FC = () => {
    return (
        <Size width="100%" height="100%">
            {({width, height}) => <ChaosBoard boxWidth={width} boxHeight={height} />}
        </Size>
    )
}

type ChaosBoardProps = {boxWidth: number, boxHeight: number};

const MAX_ITERATION = 10;

const ChaosBoard: React.FC<ChaosBoardProps> = ({boxWidth, boxHeight}: ChaosBoardProps) => {
    const css                   = useChaosStyles();
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const width                 = useDerivedValue(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = useDerivedValue(() => Math.floor(boxHeight / SIZE), [boxHeight]);

    React.useEffect(
        () => {
            let i       = 0;
            let j       = 0;
            let stop    = false;
            const context   = canvas.current!.getContext('2d');


            function draw() {
                for(let q = 0; q < 1 && !stop; ++q) {
                    const x0        = i * (3.5 / width) - 2.5;
                    const y0        = j * (2.0 / height) - 1.0;
                    let x           = new BigFloat32(0.0);
                    let y           = new BigFloat32(0.0);
                    let iteration   = 0;

                    while(x.mul(x).add(y.mul(y)).cmp(4) < 0 && iteration < MAX_ITERATION) {
                        const t = x.mul(x).sub(y.mul(y)).add(x0);
                        y = x.mul(y).mul(2).add(y0);
                        x = t;
                        ++iteration;
                    }

                    const color = Math.max(0, Math.min(255, Math.floor(256 * (iteration / MAX_ITERATION))));
                    const grey  = color.toString(16).padStart(2, '0');


                    context!.fillStyle = `#${grey}${grey}${grey}`;

                    context!.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);

                    ++i;
                    if(i >= width) {
                        i = 0;
                        ++j;
                        if(j >= height)
                            stop = true;
                    }

                    setTimeout(draw, 100);
                }
            }

            draw();
            return () => { stop = true; };
        },
        [width, height]
    )

    return (
        <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight}>
        </canvas>
    );
}

export default Chaos;
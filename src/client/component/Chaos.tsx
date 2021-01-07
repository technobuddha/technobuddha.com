import React                from 'react';
import { Size }             from 'mui-size';
import { makeStyles }       from '@material-ui/core/styles';
import {chaos}              from '#worker/chaos';
import { useDerivedState }  from '@technobuddha/react-hooks';
import type { RGBV }        from '#worker/chaos';

const SIZE          = 1;
const MAX_ITERATION = 256;

const useChaosStyles = makeStyles({
    compute: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        backgroundColor: 'yellow'
    },
    canvas: {
        border: 'none',
        padding: 0,
        margin: 0,
    },
});

export const Chaos: React.FC = () => {
    return (
        <Size width="100%" height="100%">
            {({width, height}) => <ChaosBoard boxWidth={width} boxHeight={height} />}
        </Size>
    )
}

type ChaosBoardProps = {boxWidth: number, boxHeight: number};
type Mode = 'compute' | 'display';

const ChaosBoard: React.FC<ChaosBoardProps> = ({boxWidth, boxHeight}: ChaosBoardProps) => {
    const css                   = useChaosStyles();
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const width                 = React.useMemo(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = React.useMemo(() => Math.floor(boxHeight / SIZE), [boxHeight]);
    const [ mode, setMode ]     = useDerivedState<Mode>('compute', [width, height]);
    const grid                  = React.useRef<RGBV[][]>([]);

    console.log('chaos render', mode);
    React.useEffect(
        () => {
            console.log('effect', mode)
            if(mode === 'compute') {
                chaos.mandelbrot(width, height, MAX_ITERATION)
                .then(chaosGrid => {
                    setMode('display');
                    grid.current = chaosGrid;
                })
                .catch(err => console.error(err));
            } else if(mode === 'display') {
                setTimeout(
                    () => {
                        console.error('draw')
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
                                const rgb = grid.current[i][j];
        
                                setPixel(i, j, rgb.r, rgb.g, rgb.b);
                            }
                        }
        
                        context.putImageData(imageData, 0, 0);
                    }
                ),
                0
            }
        },
        [mode]
    )

    return (
        <div style={{width: boxWidth, height: height, position: 'relative'}}>
            {
                mode === 'compute' &&
                <div className={css.compute}>I&apos;m thinking about thinking about chaos</div>
            }
            <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight}>
            </canvas>
        </div>
    );
}

export default Chaos;
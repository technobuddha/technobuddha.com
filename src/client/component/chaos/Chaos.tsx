import React                from 'react';
import { LinearProgress }   from '@material-ui/core';
import { makeStyles }       from '@material-ui/core/styles';
import { useDerivedState }  from '@technobuddha/react-hooks';
import { Size }             from 'mui-size';
import { useTranslation }   from '#context/i18n';
import {chaos}              from '#worker/chaos';
import type { RGBV }        from '#worker/chaos';

const SIZE          = 1;
const MAX_ITERATION = 256;

const useChaosStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        backgroundColor: theme.palette.primary.light,
    },
    compute: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        backgroundColor: theme.palette.secondary.light,
        border: `${theme.spacing(5)}px solid ${theme.palette.secondary.main}`,
        borderRadius: '50%',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    op: {
        color: theme.palette.secondary.contrastText,
        fontSize: '1.00rem',
        margin: `0 0 ${theme.spacing(1)}px 0`,
    },
    text: {
        color: theme.palette.secondary.contrastText,
        fontSize: '1.25rem',
        margin: `0 0 ${theme.spacing(2)}px 0`,
    },
    canvas: {
        border: 'none',
        padding: 0,
        margin: 0,
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
type Mode = 'compute' | 'display';

const ChaosBoard: React.FC<ChaosBoardProps> = ({boxWidth, boxHeight}: ChaosBoardProps) => {
    const css                   = useChaosStyles();
    const { t }                 = useTranslation();
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const width                 = React.useMemo(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = React.useMemo(() => Math.floor(boxHeight / SIZE), [boxHeight]);
    const [ mode, setMode ]     = useDerivedState<Mode>('compute', [width, height]);
    const grid                  = React.useRef<RGBV[][]>([]);

    React.useEffect(
        () => {
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
        <div className={css.root} style={{width: boxWidth, height: height}}>
            {
                mode === 'compute' &&
                <div className={css.compute}>
                    <div className={css.op}>
                        {t('Computing')}
                    </div>
                    <div className={css.text}>
                        {t('The Mandelbrot Set')}
                    </div>
                    <LinearProgress style={{width: '50%'}} color="primary" />
                </div>
            }
            <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight}>
            </canvas>
        </div>
    );
}

export default Chaos;
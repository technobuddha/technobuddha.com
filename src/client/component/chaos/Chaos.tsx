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

    const x_min                 = React.useRef(-2.00);
    const x_max                 = React.useRef(+0.75);
    const y_min                 = React.useRef(-1.25);
    const y_max                 = React.useRef(+1.25);

    const mouseIsDown           = React.useRef(false);
    const corner                = React.useRef({x: 0, y: 0});

    const coordinates = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { top, left, width, height } = canvas.current!.getBoundingClientRect();
        const clientX = event.clientX - left;
        const clientY = event.clientY - top;
        const x = x_min.current + (clientX / width)  * (x_max.current - x_min.current);
        const y = y_min.current + (clientY / height) * (y_max.current - y_min.current);
        return {x, y};
    }

    const handleMouseDown       = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if(mode === 'display') {
            mouseIsDown.current = true;
            corner.current      = coordinates(event);
        }
    }

    const handleMouseUp         = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if(mode === 'display') {
            if(mouseIsDown.current) {
                const { x, y } = coordinates(event);

                x_min.current = Math.min(corner.current.x, x);
                x_max.current = Math.max(corner.current.x, x);
                y_min.current = Math.min(corner.current.y, y);
                y_max.current = Math.max(corner.current.y, y);
                mouseIsDown.current = false;
                setMode('compute');
            }
        }
    };

    React.useEffect(
        () => {
            if(mode === 'compute') {
                chaos.mandelbrot(width, height, x_min.current, x_max.current, y_min.current, y_max.current, MAX_ITERATION)
                .then(result => {
                    grid.current = result.colors;
                    x_min.current = result.x_min;
                    x_max.current = result.x_max;
                    y_min.current = result.y_min;
                    y_max.current = result.y_max;
                    console.log(x_min.current, x_max.current, y_min.current, y_max.current);
                    setMode('display');
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
            <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            </canvas>
        </div>
    );
}

export default Chaos;
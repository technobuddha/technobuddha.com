import React                from 'react';
import { LinearProgress }   from '@material-ui/core';
import { useDerivedState }  from '@technobuddha/react-hooks';
import { Size }             from 'mui-size';
import { useTranslation }   from '#context/i18n';
import { chaos }            from '#worker/chaos';
import css                  from './Chaos.module.css';

import type { RGBV }        from '#worker/chaos';

const SIZE          = 1;
const MAX_ITERATION = 1024;

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
    const { t }                 = useTranslation();
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const overlay               = React.useRef<HTMLCanvasElement>(null);
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
        const { top, left } = canvas.current!.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
        return {x, y};
    }

    const scaledCoordinates = ({x: clientX, y: clientY}: {x: number, y: number}) => {
        const x = x_min.current + (clientX / width)  * (x_max.current - x_min.current);
        const y = y_min.current + (clientY / height) * (y_max.current - y_min.current);
        return {x, y};
    }

    const clearOverlay = () => {
        const context   = overlay.current!.getContext('2d')!;
        context.clearRect(0, 0, width, height);
        return context;
    }

    const handleMouseDown       = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if(mode === 'display') {
            event.stopPropagation();
            event.preventDefault();

            if(event.button === 2) {
                const x_mid = (x_min.current + x_max.current) / 2;
                const y_mid = (y_min.current + y_max.current) / 2;

                console.log(x_min.current, x_max.current, y_min.current, y_max.current);
                x_min.current = x_mid - (x_mid - x_min.current) * Math.sqrt(10);
                x_max.current = x_mid + (x_max.current - x_mid) * Math.sqrt(10);
                y_min.current = y_mid - (y_mid - y_min.current) * Math.sqrt(10);
                y_max.current = y_mid + (y_max.current - y_mid) * Math.sqrt(10);
                console.log(x_min.current, x_max.current, y_min.current, y_max.current);
                setMode('compute');
            } else {
                mouseIsDown.current = true;
                corner.current      = coordinates(event);
            }
        }
    }

    const handleMouseUp         = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if(mode === 'display') {
            if(mouseIsDown.current) {
                const click  = coordinates(event);

                if(Math.abs(click.x - corner.current.x) < 10 || Math.abs(click.y - corner.current.y) < 10) {
                    clearOverlay();
                } else {
                    const first  = scaledCoordinates(corner.current);
                    const second = scaledCoordinates(click);

                    x_min.current = Math.min(first.x, second.x);
                    x_max.current = Math.max(first.x, second.x);
                    y_min.current = Math.min(first.y, second.y);
                    y_max.current = Math.max(first.y, second.y);
                    setMode('compute');
                }
                mouseIsDown.current = false;
            }
        }
    };

    const handleMouseMove       = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if(mode === 'display' && mouseIsDown.current) {
            const { x, y }  = coordinates(event);
            const context   = clearOverlay();
            context.strokeStyle = 'white';
            context.strokeRect(x, y, corner.current.x - x, corner.current.y - y);
        }
    }

    const handleContextMenu     = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        return false;
    }

    React.useEffect(
        () => {
            if(mode === 'compute') {
                clearOverlay();

                chaos.mandelbrot(width, height, x_min.current, x_max.current, y_min.current, y_max.current, MAX_ITERATION)
                .then(result => {
                    grid.current = result.colors;
                    x_min.current = result.x_min;
                    x_max.current = result.x_max;
                    y_min.current = result.y_min;
                    y_max.current = result.y_max;
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
        <div className={css.chaos} style={{width: boxWidth, height: height}} onContextMenu={handleContextMenu}>
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
            <canvas ref={canvas} className={css.canvas} width={boxWidth} height={boxHeight} />
            <canvas
                ref={overlay}
                className={css.overlay}
                width={boxWidth}
                height={boxHeight}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onContextMenu={handleContextMenu}
            />

        </div>
    );
}

export default Chaos;
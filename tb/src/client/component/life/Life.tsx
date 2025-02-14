import React                from 'react';
import { create2DArray }    from '@technobuddha/library/create2DArray';
import { useDerivedState }  from '@technobuddha/react-hooks';
import splitLines           from '@technobuddha/library/splitLines';
import clean                from '@technobuddha/library/clean';
import { space }            from '@technobuddha/library/constants';
import { Size }             from '@technobuddha/mui-size';

const MOVES = [[ 1, 1 ], [ 1, 0 ], [ 1, -1 ], [ 0, -1 ], [ -1, -1 ], [ -1, 0 ], [ -1, 1 ], [ 0, 1 ]];
const SIZE  = 4;
const START =
//  **
// **
//  *
// `;
`
 *
   *
**  ***
`;

export const Life: React.FC = () => {
    return (
        <Size width="100%" height="100%">
            {
                ({ width, height }) =>
                    <LifeBoard start={START} boxWidth={width} boxHeight={height} />
            }
        </Size>
    );
};

type LifeBoardProps = {
    start: string;
    boxWidth: number;
    boxHeight: number;
    children?: never;
};

const LifeBoard: React.FC<LifeBoardProps> = ({ boxWidth, boxHeight, start }: LifeBoardProps) => {
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const width                 = React.useMemo(() => Math.floor(boxWidth / SIZE),  [ boxWidth ]);
    const height                = React.useMemo(() => Math.floor(boxHeight / SIZE), [ boxHeight ]);
    const [ move,  setMove ]      = React.useState(0);
    const history               = React.useMemo(() => [] as boolean[][][], [ width, height, start ]);
    const [ board, setBoard ]     = useDerivedState(
        () => {
            const b = create2DArray(width, height, false);

            const lines = splitLines(clean(start, '\n'));
            const w     = Math.max(...lines.map(line => line.length));
            const h     = lines.length;
            const x     = Math.floor((width - w)  / 2);
            const y     = Math.floor((height - h) / 2);

            for(let i = 0; i < w; ++i) {
                for(let j = 0; j < h; ++j) {
                    if(((lines[j][i]) ?? space) !== space)
                        b[i + x][j + y] = true;
                }
            }
            return b;
        },
        [ width, height, start ]
    );

    const detectGlider = React.useMemo(
        () => {
            return (activeBoard: boolean[][], context: CanvasRenderingContext2D) => {
                const w = width  - 1;
                const h = height - 1;

                const kill = (x: number, y: number) => {
                    context.fillStyle = 'red';

                    for(let i = x; i < x + 3; ++i) {
                        for(let j = y; j < y + 3; ++j) {
                            if(activeBoard[i][j]) {
                                activeBoard[i][j] = false;
                                context.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
                            }
                        }
                    }
                };

                for(let x = 1; x < w; ++x) {
                    if(
                        activeBoard[x][0] &&
                        activeBoard[x][1] &&
                        (activeBoard[x - 1][1] !== activeBoard[x + 1][1]) &&
                        activeBoard[x - 1][2] &&
                        activeBoard[x + 1][2]
                    )
                        kill(x - 1, 0);

                    if(
                        activeBoard[x][h] &&
                        activeBoard[x][h - 1] &&
                        (activeBoard[x - 1][h - 1] !== activeBoard[x + 1][h - 1]) &&
                        activeBoard[x - 1][h - 2] &&
                        activeBoard[x + 1][h - 2]
                    )
                        kill(x - 1, h - 2);
                }

                for(let y = 1; y < h; ++y) {
                    if(
                        activeBoard[0][y] &&
                        activeBoard[1][y] &&
                        (activeBoard[1][y - 1] !== activeBoard[1][y + 1]) &&
                        activeBoard[2][y - 1] &&
                        activeBoard[2][y + 1]
                    )
                        kill(0, y - 1);

                    if(
                        activeBoard[w][y] &&
                        activeBoard[w - 1][y] &&
                        (activeBoard[w - 1][y - 1] !== activeBoard[w - 1][y + 1]) &&
                        activeBoard[w - 2][y - 1] &&
                        activeBoard[w - 2][y + 1]
                    )
                        kill(w - 2, y - 1);
                }
            };
        },
        [ width, height ]
    );

    React.useEffect(
        () => {
            const timer = setTimeout(
                () => {
                    const context   = canvas.current!.getContext('2d')!;

                    if(move === 0) {
                        context.fillStyle = 'powderblue';
                        context.fillRect(0, 0, width * SIZE, height * SIZE);

                        context.fillStyle = 'black';
                        for(const [ i, row ] of board.entries()) {
                            for(const [ j, cell ] of row.entries()) {
                                if(cell)
                                    context.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
                            }
                        }

                        setMove(1);
                    } else {
                        const nextBoard = create2DArray(width, height, false);
                        for(const [ i, row ] of board.entries()) {
                            for(const [ j, cell ] of row.entries()) {
                                const neighbors = MOVES.reduce(
                                    (acc, [ deltaX, deltaY ]) => {
                                        const newX = i + deltaX;
                                        const newY = j + deltaY;

                                        return acc + ((newX >= 0 && newX < width && newY >= 0 && newY < height && board[newX][newY]) ? 1 : 0);
                                    },
                                    0
                                );

                                switch(neighbors) {
                                    case 0: case 1: case 4: case 5: case 6: case 7: case 8:
                                        if(cell) {
                                            context.fillStyle = 'white';
                                            context.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
                                        }
                                        nextBoard[i][j] = false;
                                        break;

                                    case 2:
                                        nextBoard[i][j] = cell;
                                        break;

                                    case 3:
                                        if(!cell) {
                                            context.fillStyle = 'black';
                                            context.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
                                        }
                                        nextBoard[i][j] = true;
                                        break;

                                    default:
                                        break;
                                }
                            }
                        }

                        detectGlider(nextBoard, context);

                        let equal = false;
                        for(let i = 0; !equal && i < history.length; ++i) {
                            equal = true;
                            for(let j = 0; equal && j < width; ++j) {
                                for(let k = 0; equal && k < height; ++k) {
                                    if(board[j][k] !== history[i][j][k])
                                        equal = false;
                                }
                            }
                        }

                        if(history.length >= 3) history.shift();
                        history.push(board);

                        if(!equal) {
                            setBoard(nextBoard);
                            setMove(m => m + 1);
                        }
                    }
                },
                0
            );

            return () => { clearTimeout(timer); };
        },
        [ board, move ]
    );

    return (
        <canvas ref={canvas} width={boxWidth} height={boxHeight} />
    );
};

export default Life;

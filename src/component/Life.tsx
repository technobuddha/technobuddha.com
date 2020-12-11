import React                                from 'react';
import { create2DArray }                    from '@technobuddha/library/create2DArray';
import { useDerivedState, useDerivedValue } from '@technobuddha/react-hooks';
import splitLines                           from '@technobuddha/library/splitLines';
import clean                                from '@technobuddha/library/clean';
import { space }                            from '@technobuddha/library/constants';
import { Size }                             from 'mui-size';

const MOVES = [[1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,1]];
const SIZE  = 8;
const START = `
 **
**
 *
`;
// const START = `
//  *
//    *
// **  ***
// `

/*
DR DL UR UL
 *  * ******
  **    **
****** *  *
* ** * *  *
 ****  **** 
 *  * * ** *
  **   **** 
* ** ** ** *
 ****   **
*   * **  **
 ****  ****
**  ***    * 
*/
export const Life: React.FC = () => {
    return (
        <Size width="100%" height="100%">
            {
                ({width, height}) => 
                    <LifeBoard start={START} boxWidth={width} boxHeight={height} />
            }
        </Size>
    )
}

type LifeBoardProps = {
    start: string;
    boxWidth: number;
    boxHeight: number;
    children?: never;
};

const LifeBoard: React.FC<LifeBoardProps> = ({boxWidth, boxHeight, start}: LifeBoardProps) => {
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const width                 = useDerivedValue(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = useDerivedValue(() => Math.floor(boxHeight / SIZE), [boxHeight])
    const [move,  setMove]      = React.useState(0);
    const history               = useDerivedValue(() => [] as boolean[][][], [width, height, start]);
    const [board, setBoard]     = useDerivedState(
        () => {
            const b = create2DArray(width, height, false);

            const lines = splitLines(clean(start, '\n'));
            const w     = Math.max(...lines.map(line => line.length));
            const h     = lines.length;
            const x     = Math.floor((width - w)  / 2);
            const y     = Math.floor((height - h) / 2);

            for(let i = 0; i < w; ++i)
                for(let j = 0; j < h; ++j)
                    if(((lines[j]?.[i]) ?? space) !== space) {
                        b[i + x][j + y] = true;
                    }
            return b;
        },
        [width, height, start]
    );

    React.useEffect(
        () => {
            const timer = setTimeout(
                () => {
                    const context   = canvas.current!.getContext('2d')!;

                    if(move == 0) {
                        context.fillStyle = 'powderblue';
                        context.fillRect(0, 0, width * SIZE, height * SIZE);

                        context.fillStyle = 'black';
                        board.forEach(
                            (row, i) => {
                                row.forEach(
                                    (cell, j) => {
                                        if(cell)
                                            context.fillRect(i * SIZE, j * SIZE, SIZE, SIZE); 
                                    }
                                )
                            }
                        );

                        setMove(1);
                    } else {
                        const nextBoard = create2DArray(width, height, false);
                        board.forEach(
                            (row, i) => {
                                row.forEach(
                                    (cell, j) => {
                                        const neighbors = MOVES.reduce(
                                            (acc, [deltaX, deltaY]) => {
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
                                        }
                                    }
                                )
                            }
                        );

                        context.fillStyle = 'red';
                        for(let i = 0; i < width; ++i) {
                            if(nextBoard[i][0]) {
                                nextBoard[i][0] = false;
                                context.fillRect(i * SIZE, 0 * SIZE, SIZE, SIZE);    
                            }

                            const l = height - 1;
                            if(nextBoard[i][l]) {
                                nextBoard[i][l] = false;
                                context.fillRect(i * SIZE, l * SIZE, SIZE, SIZE);
                            }
                        }

                        for(let i = 0; i < height; ++i) {
                            if(nextBoard[0][i]) {
                                nextBoard[0][i] = false;
                                context.fillRect(0 * SIZE, i * SIZE, SIZE, SIZE);    
                            }

                            const l = width - 1;
                            if(nextBoard[l][i]) {
                                nextBoard[l][i] = false;
                                context.fillRect(l * SIZE, i * SIZE, SIZE, SIZE);
                            }
                        }

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
                            setMove(move => move + 1);
                        }
                    }
                },
                0
            );

            return () => clearTimeout(timer);
        },
        [board, move]
    )

    return (
        <canvas ref={canvas} width={boxWidth} height={boxHeight}>
        </canvas>
    );
}

export default Life;
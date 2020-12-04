import React                                from 'react';
import { create2DArray }                    from '@technobuddha/library/create2DArray';
import { useDerivedState, useDerivedValue } from '@technobuddha/react-hooks';
import { Size }                             from 'mui-size';

const MOVES = [[1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,1]];
const SIZE  = 8;

export const Life: React.FC = () => {
    return (
        <Size width="100%" height="100%">
            {
                ({width, height}) => 
                    <LifeBoard boxWidth={width} boxHeight={height} />
            }
        </Size>
    )
}

type LifeBoardProps = {
    boxWidth: number;
    boxHeight: number;
    children?: never;
};

const LifeBoard: React.FC<LifeBoardProps> = ({boxWidth, boxHeight}: LifeBoardProps) => {
    const canvas                = React.useRef<HTMLCanvasElement>(null);
    const width                 = useDerivedValue(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = useDerivedValue(() => Math.floor(boxHeight / SIZE), [boxHeight])
    const [move,  setMove]      = React.useState(0);

    const [board, setBoard]     = useDerivedState(
        () => {
            const b = create2DArray(width, height, false);
            b[58][50] = true;
            b[59][50] = true;
            b[57][51] = true;
            b[58][51] = true;
            b[58][52] = true;
            return b;
        },
        [width, height]
    );

    React.useEffect(
        () => {
            const timer = setTimeout(
                () => {
                    if(move < 1102) {
                        const context   = canvas.current!.getContext('2d')!;
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

                        setBoard(nextBoard);
                        setMove(move => move + 1);
                    }
                },
                0
            );

            return () => clearTimeout(timer);
        },
        [board]
    )

    return (
        <canvas ref={canvas} width={boxWidth} height={boxHeight}>
        </canvas>
    );
}

export default Life;
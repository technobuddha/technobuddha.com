import React                                from 'react';
import clsx                                 from 'clsx';
import { create2DArray }                    from '@technobuddha/library/create2DArray';
import { useDerivedState, useDerivedValue } from '@technobuddha/react-hooks';
import { Size }                             from 'mui-size';
import { makeStyles }                       from '@material-ui/core/styles';

const MOVES = [[1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,1]];
const SIZE  = 4;

const useLifeStyles = makeStyles(theme => ({
    board: {
        width: '100%',
        height: '100%',
        border: `1px solid ${theme.palette.primary.main}`,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    column: { 
        display: 'flex',
        flexDirection:'column',
    },
    square: {
        width: SIZE,
        height: SIZE,
        minWidth: SIZE,
        minHeight: SIZE,
        //borderLeft: `1px solid ${theme.palette.primary.light}`,
        //borderBottom: `1px solid ${theme.palette.primary.light}`,
    },
    life: {
        background: theme.palette.primary.main,
    },
}));

export const Life: React.FC = () => {
    return (
        <Size width="100%" height="100%">
            {({width, height}) => <LifeBoard boxWidth={width} boxHeight={height} />}
        </Size>
    )
}

type LifeBoardProps = {boxWidth: number, boxHeight: number};

const LifeBoard: React.FC<LifeBoardProps> = ({boxWidth, boxHeight}: LifeBoardProps) => {
    const css                   = useLifeStyles();
    const div                   = React.useRef<HTMLDivElement>(null);
    const width                 = useDerivedValue(() => Math.floor(boxWidth / SIZE),  [boxWidth]);
    const height                = useDerivedValue(() => Math.floor(boxHeight / SIZE), [boxHeight])
    const [move,  setMove]      = React.useState(0);
    const [board, setBoard]     = useDerivedState(
        () => {
            const b = create2DArray(width, height, false);
            console.log(width, height, b);
            b[58][50] = true;
            b[59][50] = true;
            b[57][51] = true;
            b[58][51] = true;
            b[58][52] = true;
            return b;
        },
        [width, height]
    );
    const ui                    = useDerivedValue(
        () => {
            const b = create2DArray(height, width, () => {
                const element = document.createElement('div');
                return element;
            });
            return b;
        },
        [width, height]
    );

    React.useEffect(
        () => {
            ui.forEach(
                row => {
                    row.forEach(
                        element => {
                            div.current!.appendChild(element);
                        }
                    )
                }
            )
        },
        [false]
    )

    React.useEffect(
        () => {
            const timer = setTimeout(
                () => {
                    if(move < 1000) {
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
                                            case 0:
                                            case 1:
                                            case 4:
                                            case 5:
                                            case 6:
                                            case 7:
                                            case 8:
                                                nextBoard[i][j] = false;
                                                break;

                                            case 2:
                                                nextBoard[i][j] = cell;
                                                break;

                                            case 3:
                                                nextBoard[i][j] = true;
                                                break;
                                        }
                                    }
                                )
                            }
                        );

                        nextBoard.forEach(
                            (row, i) => {
                                row.forEach(
                                    (cell, j) => {
                                        ui[j][i].className = clsx(css.square, cell && css.life)
                                    }
                                )
                            }
                        )

                        setBoard(nextBoard);
                        setMove(move => move + 1);
                    }
                },
                50
            );

            return () => clearTimeout(timer);
        },
        [board]
    )

    return (
        <div ref={div} className={css.board}>
        </div>
    );
}

export default Life;
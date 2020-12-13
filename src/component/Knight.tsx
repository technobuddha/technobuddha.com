import React                from 'react';
import clsx                 from 'clsx';
import { nbsp  }            from '@technobuddha/library/constants';
import { create2DArray }    from '@technobuddha/library/create2DArray';
import { numberToLetter }   from '@technobuddha/library/numberToLetter';
import { useDerivedState }  from '@technobuddha/react-hooks';
import range                from 'lodash/range';
import Box                  from '@material-ui/core/Box';
import Typography           from '@material-ui/core/Typography'
import Select               from '@material-ui/core/Select';
import InputLabel           from '@material-ui/core/InputLabel';
import FormControl          from '@material-ui/core/FormControl';
import MenuItem             from '@material-ui/core/MenuItem';
import { makeStyles }       from '@material-ui/core/styles';

const blackKnight        = '♞';

const MOVES = [[1,2], [2,1], [-1,2], [-2,1], [1, -2], [2,-1], [-1,-2], [-2,-1]];

class Square {
    constructor(public x: number, public y:number) {
    }

    public moves(board: (number | null)[][], move: number): Square[] {
        return Array.from((function*(x: number, y: number) {
            const width     = board.length;
            const height    = board.length > 0 ? board[0].length : 0;

            for(const [deltaX, deltaY] of MOVES) {
                const newX = x + deltaX;
                const newY = y + deltaY;
                if(newX >= 0 && newX < width && newY >= 0 && newY < height && board[newX][newY] === null) {
                    board[newX][newY] = move;
                    yield new Square(newX, newY);
                }
            } 
        })(this.x, this.y));
    }

    public in(positions: Square[]) {
        return positions.some(pos => this.equalTo(pos));
    }

    public equalTo(position: Square) {
        return this.x === position.x && this.y === position.y;
    }
}

const useKnightStyles = makeStyles({
    solution: {
        fontSize: 'x-large',
        textAlign: 'center',
    }
})

export const Knight: React.FC = () => {
    const css                        = useKnightStyles();
    const [width,    setWidth]       = React.useState(8);
    const [height,   setHeight]      = React.useState(8);
    const [startX,   setStartX]      = React.useState(0);
    const [startY,   setStartY]      = React.useState(0);
    const [finishX,  setFinishX]     = React.useState(1);
    const [finishY,  setFinishY]     = React.useState(1);
    const [solution, setSolution]    = React.useState<null | number>(null);

    type OnChangeEvent = React.ChangeEvent<{name?: string; value: unknown;}>;

    const handleWidthChange = (event: OnChangeEvent) => {
        const newValue = Number.parseInt(event.target.value as string);
        setWidth(newValue);
        if(startX  >= newValue) setStartX(newValue-1);
        if(finishX >= newValue) setFinishX(newValue-1);
        setSolution(null);
    }

    const handleHeightChange = (event: OnChangeEvent) => {
        const newValue = Number.parseInt(event.target.value as string);
        setHeight(newValue);
        if(startY  >= newValue) setStartY(newValue-1);
        if(finishY >= newValue) setFinishY(newValue-1);
        setSolution(null);
    }

    const handleStartXChange = (event: OnChangeEvent) => {
        const newValue = Number.parseInt(event.target.value as string);
        setStartX(newValue);
        setSolution(null);
    }

    const handleFinishXChange = (event: OnChangeEvent) => {
        const newValue = Number.parseInt(event.target.value as string);
        setFinishX(newValue);
        setSolution(null);
    }

    const handleStartYChange = (event: OnChangeEvent) => {
        const newValue = Number.parseInt(event.target.value as string);
        setStartY(newValue);
        setSolution(null);
    }

    const handleFinishYChange = (event: OnChangeEvent) => {
        const newValue = Number.parseInt(event.target.value as string);
        setFinishY(newValue);
        setSolution(null);
    }

    return (
        <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column" marginRight={4}>
                <Box display="flex" flexDirection="row" marginBottom={1}>
                    <FormControl>
                        <InputLabel htmlFor="width">Width</InputLabel>
                        <Select
                            value={width}
                            onChange={handleWidthChange}
                            inputProps={{
                                name: 'width',
                                id: 'width'
                            }}
                        >
                            {range(1, 26).map(i => <MenuItem key={i} value={i}>{i.toString()}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="height">Height</InputLabel>
                        <Select
                            value={height}
                            onChange={handleHeightChange}
                            inputProps={{
                                name: 'height',
                                id: 'height'
                            }}
                        >
                            {range(1, 26).map(i => <MenuItem key={i} value={i}>{i.toString()}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box display="flex" flexDirection="row" marginBottom={1}>
                    <FormControl>
                        <InputLabel htmlFor="startX">Start Row</InputLabel>
                        <Select
                            value={startX}
                            onChange={handleStartXChange}
                            inputProps={{
                                name: 'startX',
                                id: 'startX'
                            }}
                        >
                            {range(0, width).map(i => <MenuItem key={i} value={i}>{(i+1).toString()}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="startX">Start Column</InputLabel>
                       <Select
                            value={startY}
                            onChange={handleStartYChange}
                            inputProps={{
                                name: 'startY',
                                id: 'startY'
                            }}
                        >
                            {range(0, height).map(i => <MenuItem key={i} value={i}>{numberToLetter(i+1)}</MenuItem>)}
                        </Select>
                    </FormControl> 
                </Box>
                <Box display="flex" flexDirection="row" marginBottom={1}>
                    <FormControl>
                        <InputLabel htmlFor="finishX">finish Row</InputLabel>
                        <Select
                            value={finishX}
                            onChange={handleFinishXChange}
                            inputProps={{
                                name: 'finishX',
                                id: 'finishX'
                            }}
                        >
                            {range(0, width).map(i => <MenuItem key={i} value={i}>{(i+1).toString()}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="finishY">Finish Column</InputLabel>
                        <Select
                            value={finishY}
                            onChange={handleFinishYChange}
                            inputProps={{
                                name: 'finishY',
                                id: 'finishY'
                            }}
                        >
                            {range(0, height).map(i => <MenuItem key={i} value={i}>{numberToLetter(i+1)}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <div>Number of Moves</div>
                    <div className={css.solution}>{solution === null ? nbsp : solution}</div>
                </Box>           
            </Box>
            <Box>
                <KnightSolver width={width} height={height} startX={startX} startY={startY} finishX={finishX} finishY={finishY} onSolved={setSolution} />
            </Box>
        </Box>
    );
}

export type KnightSolverProps = {
    width:      number;
    height:     number;
    startX:     number;
    startY:     number;
    finishX:    number;
    finishY:    number;
    onSolved?:  (moves: number | null) => void;
    children?:  never,
}

const useKnightSolverStyles = makeStyles(theme => ({
    board: {
        border: `1px solid ${theme.palette.primary.main}`,
        display: 'inline-flex',
        flexDirection: 'row',
    },
    column: { 
        display: 'flex',
        flexDirection:'column',
    },
    square: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        border: `1px solid ${theme.palette.primary.light}`,
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: theme.spacing(2.25),
    },
    legend: {
        background: theme.palette.grey[300],
    },
    target: {
        borderWidth: 2,
        borderColor: theme.palette.secondary.dark,
    },
    moves: {
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        "&$target": {
            color: theme.palette.secondary.main,
        }
    }
}))

export const KnightSolver = ({height, width, startX, startY, finishX, finishY, onSolved}: KnightSolverProps) => {
    const css                       = useKnightSolverStyles();
    const [move, setMove]           = useDerivedState(() => 0,                              [height, width, startX, startY]);
    const [positions, setPositions] = useDerivedState(() => [new Square(startX, startY)],    [height, width, startX, startY]);
    const target                    = React.useMemo(() => new Square(finishX, finishY),    [finishX, finishY]);
    const board                     = React.useMemo(
        () => {
            const board = create2DArray<number | null>(width, height, null);
            board[startX][startY] = 0;
            return board;
        },
        [height, width, startX, startY]
    );

    React.useEffect(
        () => {
            if(positions.length > 0) {
                positions.forEach(pos => { board[pos.x][pos.y] = move; });
                const timer = setTimeout(
                    () => {
                        setPositions(positions.flatMap(pos => pos.moves(board, move+1)));
                        setMove(move + 1);
                    },
                    250
                );

                return () => clearTimeout(timer);
            }

            onSolved?.(board[target.x][target.y]);

            return () => undefined;
        },
        [move, board, finishX, finishY]
    )

    return (
        <Box className={css.board}>
            <Box key="X" className={css.column}>
                <Typography className={clsx(css.square, css.legend)}></Typography >
                {
                    range(0, height).map(i => <Typography key={i} className={clsx(css.square, css.legend)}>{i+1}</Typography >)
                }
            </Box>
            {
                board.map(
                    (row, i) => (
                        <Box key={i} className={css.column}>
                            <Typography className={clsx(css.square, css.legend)}>{numberToLetter(i+1)}</Typography >
                            {
                                
                                row.map(
                                    (moves, j) => {
                                        const point     = new Square(i, j);
                                        const onTarget  = point.equalTo(target);
                                        const occupied  = point.in(positions);
                                        return (
                                            <Typography key={j} className={clsx(css.square, onTarget && css.target, !occupied && moves !== null && css.moves)}>
                                                {occupied ? blackKnight : moves === null ? nbsp : moves.toString()}
                                            </Typography>
                                        );
                                    }
                                )
                            }
                        </Box>
                    )
                )
            }          
        </Box>
    );
}

export default Knight;
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material';
import { nbsp, create2DArray, numberToLetter } from '@technobuddha/library';
import { useDerivedState } from '@technobuddha/react-hooks';
import clsx from 'clsx';
import { range } from 'lodash-es';

import css from './knight.module.css';

const blackKnight = '♞';

const MOVES = [
  [1, 2],
  [2, 1],
  [-1, 2],
  [-2, 1],
  [1, -2],
  [2, -1],
  [-1, -2],
  [-2, -1],
];

class Square {
  public constructor(
    public x: number,
    public y: number,
  ) {}

  public moves(board: (number | null)[][], move: number): Square[] {
    return Array.from(
      (function* makeBoard(x: number, y: number) {
        const width = board.length;
        const height = board.length > 0 ? board[0].length : 0;

        for (const [deltaX, deltaY] of MOVES) {
          const newX = x + deltaX;
          const newY = y + deltaY;
          if (
            newX >= 0 &&
            newX < width &&
            newY >= 0 &&
            newY < height &&
            board[newX][newY] === null
          ) {
            board[newX][newY] = move;
            yield new Square(newX, newY);
          }
        }
      })(this.x, this.y),
    );
  }

  public in(positions: Square[]): boolean {
    return positions.some((pos) => this.equalTo(pos));
  }

  public equalTo(position: Square): boolean {
    return this.x === position.x && this.y === position.y;
  }
}

export const Knight: React.FC = () => {
  const [width, setWidth] = React.useState(8);
  const [height, setHeight] = React.useState(8);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [finishX, setFinishX] = React.useState(1);
  const [finishY, setFinishY] = React.useState(1);
  const [solution, setSolution] = React.useState<null | number>(null);

  const handleWidthChange = React.useCallback(
    (event: SelectChangeEvent<number>): void => {
      const newValue = Number.parseInt(event.target.value as string);
      setWidth(newValue);
      if (startX >= newValue) {
        setStartX(newValue - 1);
      }
      if (finishX >= newValue) {
        setFinishX(newValue - 1);
      }
      setSolution(null);
    },
    [startX, finishX],
  );

  const handleHeightChange = React.useCallback(
    (event: SelectChangeEvent<number>): void => {
      const newValue = Number.parseInt(event.target.value as string);
      setHeight(newValue);
      if (startY >= newValue) {
        setStartY(newValue - 1);
      }
      if (finishY >= newValue) {
        setFinishY(newValue - 1);
      }
      setSolution(null);
    },
    [startY, finishY],
  );

  const handleStartXChange = React.useCallback((event: SelectChangeEvent<number>): void => {
    const newValue = Number.parseInt(event.target.value as string);
    setStartX(newValue);
    setSolution(null);
  }, []);

  const handleFinishXChange = React.useCallback((event: SelectChangeEvent<number>): void => {
    const newValue = Number.parseInt(event.target.value as string);
    setFinishX(newValue);
    setSolution(null);
  }, []);

  const handleStartYChange = React.useCallback((event: SelectChangeEvent<number>): void => {
    const newValue = Number.parseInt(event.target.value as string);
    setStartY(newValue);
    setSolution(null);
  }, []);

  const handleFinishYChange = React.useCallback((event: SelectChangeEvent<number>): void => {
    const newValue = Number.parseInt(event.target.value as string);
    setFinishY(newValue);
    setSolution(null);
  }, []);

  const handleSolved = React.useCallback((moves: number | null): void => {
    setSolution(moves);
  }, []);

  return (
    <Box display="flex" flexDirection="row">
      <Box display="flex" flexDirection="column" marginRight={4}>
        <Box display="flex" flexDirection="row" marginBottom={1}>
          <FormControl>
            <InputLabel htmlFor="width">Width</InputLabel>
            <Select<number>
              value={width}
              onChange={handleWidthChange}
              inputProps={{
                name: 'width',
                id: 'width',
              }}
            >
              {range(1, 26).map((i) => (
                <MenuItem key={i} value={i}>
                  {i.toString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="height">Height</InputLabel>
            <Select<number>
              value={height}
              onChange={handleHeightChange}
              inputProps={{
                name: 'height',
                id: 'height',
              }}
            >
              {range(1, 26).map((i) => (
                <MenuItem key={i} value={i}>
                  {i.toString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="row" marginBottom={1}>
          <FormControl>
            <InputLabel htmlFor="startX">Start Column</InputLabel>
            <Select
              value={startX}
              onChange={handleStartXChange}
              inputProps={{
                name: 'startX',
                id: 'startX',
              }}
            >
              {range(0, width).map((i) => (
                <MenuItem key={i} value={i}>
                  {numberToLetter(i + 1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="startX">Start Row</InputLabel>
            <Select
              value={startY}
              onChange={handleStartYChange}
              inputProps={{
                name: 'startY',
                id: 'startY',
              }}
            >
              {range(0, height).map((i) => (
                <MenuItem key={i} value={i}>
                  {(i + 1).toString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="row" marginBottom={1}>
          <FormControl>
            <InputLabel htmlFor="finishX">finish Column</InputLabel>
            <Select
              value={finishX}
              onChange={handleFinishXChange}
              inputProps={{
                name: 'finishX',
                id: 'finishX',
              }}
            >
              {range(0, width).map((i) => (
                <MenuItem key={i} value={i}>
                  {numberToLetter(i + 1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="finishY">Finish Row</InputLabel>
            <Select
              value={finishY}
              onChange={handleFinishYChange}
              inputProps={{
                name: 'finishY',
                id: 'finishY',
              }}
            >
              {range(0, height).map((i) => (
                <MenuItem key={i} value={i}>
                  {(i + 1).toString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <div>Number of Moves</div>
          <div className={css.solution}>{solution ?? nbsp}</div>
        </Box>
      </Box>
      <Box>
        <KnightSolver
          width={width}
          height={height}
          startX={startX}
          startY={startY}
          finishX={finishX}
          finishY={finishY}
          onSolved={handleSolved}
        />
      </Box>
    </Box>
  );
};

export type KnightSolverProps = {
  readonly width: number;
  readonly height: number;
  readonly startX: number;
  readonly startY: number;
  readonly finishX: number;
  readonly finishY: number;
  onSolved?(this: void, moves: number | null): void;
  readonly children?: never;
};

export const KnightSolver: React.FC<KnightSolverProps> = ({
  height,
  width,
  startX,
  startY,
  finishX,
  finishY,
  onSolved,
}) => {
  const [move, setMove] = useDerivedState(
    () => 0,
    [height, width, startX, startY, finishX, finishY],
  );
  const [positions, setPositions] = useDerivedState(
    () => [new Square(startX, startY)],
    [height, width, startX, startY, finishX, finishY],
  );
  const target = React.useMemo(() => new Square(finishX, finishY), [finishX, finishY]);
  const board = React.useMemo(() => {
    const b = create2DArray<number | null>(width, height, null);
    b[startX][startY] = 0;
    b[finishX][finishY] = null;
    return b;
  }, [height, width, startX, startY, finishX, finishY]);

  React.useEffect(() => {
    if (positions.length > 0) {
      for (const pos of positions) {
        board[pos.x][pos.y] = move;
      }
      const timer = setTimeout(() => {
        setPositions(positions.flatMap((pos) => pos.moves(board, move + 1)));
        setMove(move + 1);
      }, 250);

      return () => {
        clearTimeout(timer);
      };
    }

    onSolved?.(board[target.x][target.y]);

    return () => undefined;
  }, [
    move,
    board,
    finishX,
    finishY,
    onSolved,
    positions,
    target.x,
    target.y,
    setMove,
    setPositions,
  ]);

  return (
    <Box className={css.board}>
      <Box className={css.column}>
        <Typography key="-" className={clsx(css.square, css.legend)}>
          -
        </Typography>
        {range(0, height).map((i) => (
          <Typography key={i} className={clsx(css.square, css.legend)}>
            {i + 1}
          </Typography>
        ))}
      </Box>
      {board.map((row, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={i} className={css.column}>
          <Typography className={clsx(css.square, css.legend)}>{numberToLetter(i + 1)}</Typography>
          {row.map((moves, j) => {
            const point = new Square(i, j);
            const onTarget = point.equalTo(target);
            const occupied = point.in(positions);
            return (
              <Typography
                // eslint-disable-next-line react/no-array-index-key
                key={j}
                className={clsx(
                  css.square,
                  onTarget && css.target,
                  !occupied && moves !== null && css.moves,
                )}
              >
                {occupied ?
                  blackKnight
                : moves === null ?
                  nbsp
                : moves.toString()}
              </Typography>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

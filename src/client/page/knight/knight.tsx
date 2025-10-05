/* eslint-disable react/no-multi-comp */
import React from 'react';
import { create2dArray, nbsp, numberToLetter, range } from '@technobuddha/library';
import { useDerivedState } from '@technobuddha/react-hooks';
import clsx from 'clsx';

import { Box, MenuItem, Select, Typography } from '#control';

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
    (value: number): void => {
      setWidth(value);
      if (startX >= value) {
        setStartX(value - 1);
      }
      if (finishX >= value) {
        setFinishX(value - 1);
      }
      setSolution(null);
    },
    [startX, finishX],
  );

  const handleHeightChange = React.useCallback(
    (value: number): void => {
      setHeight(value);
      if (startY >= value) {
        setStartY(value - 1);
      }
      if (finishY >= value) {
        setFinishY(value - 1);
      }
      setSolution(null);
    },
    [startY, finishY],
  );

  const handleStartXChange = React.useCallback((value: number): void => {
    setStartX(value);
    setSolution(null);
  }, []);

  const handleFinishXChange = React.useCallback((value: number): void => {
    setFinishX(value);
    setSolution(null);
  }, []);

  const handleStartYChange = React.useCallback((value: number): void => {
    setStartY(value);
    setSolution(null);
  }, []);

  const handleFinishYChange = React.useCallback((value: number): void => {
    setFinishY(value);
    setSolution(null);
  }, []);

  const handleSolved = React.useCallback((moves: number | null): void => {
    setSolution(moves);
  }, []);

  return (
    <Box display="flex" flexDirection="row">
      <Box display="flex" flexDirection="column" marginRight={4}>
        <Box display="flex" flexDirection="row" marginBottom={1}>
          <Select<number> value={width} label="Width" onChange={handleWidthChange}>
            {range(1, 25).map((i) => (
              <MenuItem key={i} value={i}>
                {i.toString()}
              </MenuItem>
            ))}
          </Select>
          <Select<number> value={height} label="Height" onChange={handleHeightChange}>
            {range(1, 26).map((i) => (
              <MenuItem key={i} value={i}>
                {i.toString()}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" flexDirection="row" marginBottom={1}>
          <Select value={startX} label="Start Column" onChange={handleStartXChange}>
            {range(0, width).map((i) => (
              <MenuItem key={i} value={i}>
                {numberToLetter(i + 1)}
              </MenuItem>
            ))}
          </Select>
          <Select value={startY} label="Start Row" onChange={handleStartYChange}>
            {range(0, height).map((i) => (
              <MenuItem key={i} value={i}>
                {(i + 1).toString()}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" flexDirection="row" marginBottom={1}>
          <Select value={finishX} label="Finish Column" onChange={handleFinishXChange}>
            {range(0, width).map((i) => (
              <MenuItem key={i} value={i}>
                {numberToLetter(i + 1)}
              </MenuItem>
            ))}
          </Select>
          <Select value={finishY} label="Finish Row" onChange={handleFinishYChange}>
            {range(0, height).map((i) => (
              <MenuItem key={i} value={i}>
                {(i + 1).toString()}
              </MenuItem>
            ))}
          </Select>
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
    const b = create2dArray<number | null>(width, height, null);
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

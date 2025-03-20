/* eslint-disable react/no-multi-comp */
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { range } from 'lodash-es';

import { CanvasDrawing } from './drawing/canvas-drawing.js';
import { BrickMaze } from './maze/brick-maze.js';
import { HexagonMaze } from './maze/hexagon-maze.js';
import { type Maze, type MazeProperties } from './maze/maze.js';
import { MazeFactory } from './maze/maze-factory.js';
import { OctogonMaze } from './maze/octogon-maze.js';
import { PentagonMaze } from './maze/pentagon-maze.js';
import { SquareMaze } from './maze/square-maze.js';
import { TriangleMaze } from './maze/triangle-maze.js';
import { ZetaMaze } from './maze/zeta-maze.js';

const mazes: Record<string, (props: MazeProperties) => Maze> = {
  pentagon: (props) => new PentagonMaze(props),
  brick: (props) => new BrickMaze(props),
  square: (props) => new SquareMaze(props),
  triangle: (props) => new TriangleMaze(props),
  hexagon: (props) => new HexagonMaze(props),
  octogon: (props) => new OctogonMaze(props),
  zeta: (props) => new ZetaMaze(props),
};

type MazeDebuggerProps = {
  children?: never;
};

type MazeType = keyof typeof mazes;

export const MazeDebugger: React.FC<MazeDebuggerProps> = () => {
  const [selectedMaze, setSelectedMaze] = React.useState<MazeType>('pentagon');
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  const handleMazeChange = React.useCallback((event: SelectChangeEvent): void => {
    setSelectedMaze(event.target.value);
  }, []);

  const handleXChange = React.useCallback((event: SelectChangeEvent<number>): void => {
    setX(
      typeof event.target.value === 'string' ?
        Number.parseInt(event.target.value)
      : event.target.value,
    );
  }, []);

  const handleYChange = React.useCallback((event: SelectChangeEvent<number>): void => {
    setY(
      typeof event.target.value === 'string' ?
        Number.parseInt(event.target.value)
      : event.target.value,
    );
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      <div style={{ backgroundColor: 'lightBlue' }}>
        <MazeBoard boxWidth={500} boxHeight={500} maze={selectedMaze} x={x} y={y} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <FormControl>
          <InputLabel htmlFor="startX">Maze Type</InputLabel>
          <Select<MazeType>
            value={selectedMaze}
            onChange={handleMazeChange}
            inputProps={{
              name: 'startX',
              id: 'startX',
            }}
          >
            {Object.keys(mazes).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="x">X</InputLabel>
          <Select<number>
            value={x}
            onChange={handleXChange}
            inputProps={{
              name: 'x',
              id: 'x',
            }}
          >
            {range(0, 100).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="y">Y</InputLabel>
          <Select<number>
            value={y}
            onChange={handleYChange}
            inputProps={{
              name: 'y',
              id: 'y',
            }}
          >
            {range(0, 100).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

type MazeBoardProps = {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly maze: MazeType;
  readonly boxWidth: number;
  readonly boxHeight: number;
  readonly children?: never;
  readonly x: number;
  readonly y: number;
};

export const MazeBoard: React.FC<MazeBoardProps> = ({
  className,
  style,
  boxWidth,
  boxHeight,
  maze,
  x,
  y,
}) => {
  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (canvasMaze.current) {
      const contextMaze = new CanvasDrawing(canvasMaze.current);

      const factory = new MazeFactory({ drawing: contextMaze });

      void factory.create(mazes[maze]).then((m) => {
        m.drawX({ x, y }, 'red');
        const moves = m.neighbors({ x, y });
        for (const move of moves) {
          m.drawText(move, move.direction, 'cyan');
          // if (!mvd || mvd.x !== x || mvd.y !== y) {
          //   console.log(
          //     'move',
          //     x,
          //     y,
          //     'kind',
          //     m.cellKind({ x, y }),
          //     move,
          //     'kind',
          //     m.cellKind(move),
          //     mvd,
          //   );
          // }
        }
        // for (let i = 0; i < 2; ++i) {
        //   let j = i;
        //   for (const direction of m.directions) {
        //     m.drawPath({ y: i, x: j++, direction });
        //   }
        // }
        // for (let i = 0; i < 2; ++i) {
        //   let j = i;
        //   for (const direction of m.directions) {
        //     m.removeWall({ y: i + 4, x: 2 + j++ }, direction);
        //   }
        // }
      });
    }
  }, [boxHeight, boxWidth, maze, x, y]);

  return (
    <div
      className={className}
      style={{ ...style, position: 'relative', width: boxWidth, height: boxHeight }}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <canvas
        ref={canvasMaze}
        width={boxWidth}
        height={boxHeight}
        style={{ position: 'absolute', zIndex: 1 }}
      />
    </div>
  );
};

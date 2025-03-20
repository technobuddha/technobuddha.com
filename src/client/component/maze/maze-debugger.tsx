import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { range } from 'lodash-es';

import { CanvasDrawing } from './drawing/canvas-drawing.js';
import { BrickMaze } from './maze/brick-maze.js';
import { HexagonMaze } from './maze/hexagon-maze.js';
import { type Maze, type MazeProperties } from './maze/maze.js';
import { OctogonMaze } from './maze/octogon-maze.js';
import { PentagonMaze } from './maze/pentagon-maze.js';
import { SquareMaze } from './maze/square-maze.js';
import { TriangleMaze } from './maze/triangle-maze.js';
import { WedgeMaze } from './maze/wedge-maze.js';
import { ZetaMaze } from './maze/zeta-maze.js';
import { MazeFactory } from './maze-factory.js';

const mazes: Record<string, (props: MazeProperties) => Maze> = {
  pentagon: (props) => new PentagonMaze(props),
  brick: (props) => new BrickMaze(props),
  square: (props) => new SquareMaze(props),
  triangle: (props) => new TriangleMaze(props),
  hexagon: (props) => new HexagonMaze(props),
  octogon: (props) => new OctogonMaze(props),
  zeta: (props) => new ZetaMaze(props),
  wedge: (props) => new WedgeMaze(props),
};

type MazeDebuggerProps = {
  children?: never;
};

type MazeType = keyof typeof mazes;

export const MazeDebugger: React.FC<MazeDebuggerProps> = () => {
  const [selectedMaze, setSelectedMaze] = React.useState<MazeType>('square');
  const [show, setShow] = React.useState('moves');
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [wall, setWall] = React.useState('a');
  const [maze, setMaze] = React.useState<Maze>();
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleMazeChange = React.useCallback((event: SelectChangeEvent): void => {
    setSelectedMaze(event.target.value);
  }, []);

  const handleShowChange = React.useCallback((event: SelectChangeEvent): void => {
    setShow(event.target.value);
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

  const handleWallChange = React.useCallback((event: SelectChangeEvent): void => {
    setWall(event.target.value);
  }, []);

  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);

  const boxWidth = 500;
  const boxHeight = 500;

  React.useEffect(() => {
    if (canvasMaze.current) {
      const contextMaze = new CanvasDrawing(canvasMaze.current);

      const factory = new MazeFactory({ drawing: contextMaze });

      void factory.create(mazes[selectedMaze]).then((m) => {
        setMaze(m);
      });
    }
  }, [selectedMaze]);

  React.useEffect(() => {
    if (maze) {
      maze.draw();
      switch (show) {
        case 'walls': {
          for (let i = 0; i < maze.width; ++i) {
            for (let j = 0; j < maze.height; ++j) {
              if (maze.walls[i][j][wall]) {
                maze.drawWall({ x: i, y: j, direction: wall }, 'magenta');
              }
            }
          }

          break;
        }

        default: {
          maze.drawX({ x, y }, 'red');
          const moves = maze.neighbors({ x, y });
          for (const move of moves) {
            if (maze.inMaze(move)) {
              switch (show) {
                case 'moves': {
                  maze.drawText(move, move.direction, 'cyan');
                  break;
                }
                case 'paths': {
                  maze.drawPath({ ...move, direction: maze.opposite(move.direction) }, 'cyan');
                  break;
                }

                // no default
              }
            }
          }
          break;
        }
      }
    }
  }, [maze, selectedMaze, show, x, y, wall]);

  React.useEffect(() => {
    const err: string[] = [];

    if (maze) {
      for (const direction of maze.directions) {
        if (maze.opposite(maze.opposite(direction)) !== direction) {
          err.push(`opposite(opposite(${direction})) !== ${direction}`);
        }

        const rt = [...maze.rightTurn(direction)];
        const lt = [...maze.leftTurn(direction)];
        const rtOpposite = rt.pop();
        const ltOpposite = lt.pop();

        if (rtOpposite !== maze.opposite(direction)) {
          err.push(`last(rightTurn(${direction})) = ${rtOpposite} !== opposite(${direction})`);
        }

        if (ltOpposite !== maze.opposite(direction)) {
          err.push(`last(leftTurn(${direction})) = ${ltOpposite} !== opposite(${direction})`);
        }

        if (!rt.reverse().every((t, i) => t === lt[i])) {
          err.push(`reverse(rightTurn.reverse(${direction}) !== leftTurn`);
        }
      }

      for (const cell of maze.all()) {
        for (const move of maze.neighbors(cell)) {
          const back = maze.move(move, maze.opposite(move.direction));
          if (back) {
            if (cell.x !== back.x || cell.y !== back.y) {
              err.push(
                `{ x: ${cell.x}, y: ${cell.y}, direction: ${move.direction}} = { x: ${move.x}, y: ${move.y} } back = { x: ${back.x}, y: ${back.y}, ${maze.opposite(move.direction)} }`,
              );
            }
          } else {
            err.push(`back({ x: ${cell.x}, y: ${cell.y}, direction: ${move.direction}) = NULL`);
          }
        }
      }
    }

    setErrors(err);
  }, [maze]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      <div style={{ backgroundColor: 'lightBlue' }}>
        <div style={{ position: 'relative', width: boxWidth, height: boxHeight }}>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <canvas
            ref={canvasMaze}
            width={boxWidth}
            height={boxHeight}
            style={{ position: 'absolute', zIndex: 1 }}
          />
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <br />
        <FormControl>
          <InputLabel htmlFor="startX">Maze</InputLabel>
          <Select<MazeType> value={selectedMaze} onChange={handleMazeChange}>
            {Object.keys(mazes).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl>
          <InputLabel htmlFor="show">Show</InputLabel>
          <Select<MazeType> value={show} onChange={handleShowChange}>
            <MenuItem value="moves">Moves</MenuItem>
            <MenuItem value="paths">Paths</MenuItem>
            <MenuItem value="walls">Walls</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />
        <FormControl>
          <InputLabel htmlFor="x">X</InputLabel>
          <Select<number> value={x} onChange={handleXChange}>
            {range(0, 100).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="y">Y</InputLabel>
          <Select<number> value={y} onChange={handleYChange}>
            {range(0, 100).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        {show === 'walls' && (
          <FormControl>
            <InputLabel htmlFor="wall">Wall</InputLabel>
            <Select<string> value={wall} onChange={handleWallChange}>
              {maze?.directions.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <div style={{ flexGrow: 1 }}>
        <div style={{ height: '100%', overflowY: 'auto' }}>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

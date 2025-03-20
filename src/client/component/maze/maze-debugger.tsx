import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { range } from 'lodash-es';

import { CanvasDrawing } from './drawing/canvas-drawing.js';
import { BrickMaze } from './maze/brick-maze.js';
import { HexagonMaze } from './maze/hexagon-maze.js';
import { type Maze, type MazeProperties } from './maze/maze.js';
import { MazeFactory } from './maze-factory.js';
import { OctogonMaze } from './maze/octogon-maze.js';
import { PentagonMaze } from './maze/pentagon-maze.js';
import { SquareMaze } from './maze/square-maze.js';
import { TriangleMaze } from './maze/triangle-maze.js';
import { WedgeMaze } from './maze/wedge-maze.js';
import { ZetaMaze } from './maze/zeta-maze.js';

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
  const [selectedMaze, setSelectedMaze] = React.useState<MazeType>('pentagon');
  const [show, setShow] = React.useState('moves');
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [wall, setWall] = React.useState('a');

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
        switch (show) {
          case 'walls': {
            for (let i = 0; i < m.width; ++i) {
              for (let j = 0; j < m.height; ++j) {
                if (m.walls[i][j][wall]) {
                  m.drawWall({ x: i, y: j, direction: wall }, 'magenta');
                }
              }
            }

            break;
          }

          default: {
            m.drawX({ x, y }, 'red');
            const moves = m.neighbors({ x, y });
            for (const move of moves) {
              if (m.inMaze(move)) {
                switch (show) {
                  case 'moves': {
                    m.drawText(move, move.direction, 'cyan');
                    break;
                  }
                  case 'paths': {
                    m.drawPath({ ...move, direction: m.opposite(move.direction) }, 'cyan');
                    break;
                  }

                  // no default
                }
              }
            }
            break;
          }
        }
      });
    }
  }, [selectedMaze, show, x, y, wall]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      <div style={{ backgroundColor: 'lightBlue' }}>
        {/* <MazeBoard boxWidth={500} boxHeight={500} maze={selectedMaze} show={show} x={x} y={y} /> */}
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
              {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'].map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    </div>
  );
};

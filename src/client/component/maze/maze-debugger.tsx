/* eslint-disable react/no-multi-comp */
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

import { Drawing } from './drawing/drawing.js';
import { Blob } from './generator/blob.js';
import { GrowingTree } from './generator/growing-tree.js';
import { Kruskals } from './generator/kruskals.js';
import { type MazeGenerator, type MazeGeneratorProperties } from './generator/maze-generator.js';
import { Prims } from './generator/prims.js';
import { RecursiveBacktracker } from './generator/recursive-backtracker.js';
import { Wilsons } from './generator/wilsons.js';
import { BrickMaze } from './maze/brick-maze.js';
import { HexagonMaze } from './maze/hexagon-maze.js';
import { type Maze, type MazeProperties } from './maze/maze.js';
import { MazeFactory } from './maze/maze-factory.js';
import { OctogonMaze } from './maze/octogon-maze.js';
import { SquareMaze } from './maze/square-maze.js';
import { TriangleMaze } from './maze/triangle-maze.js';
import { ZetaMaze } from './maze/zeta-maze.js';
import { BreadthFirstSearch } from './solver/breadth-first-search.js';
import { DeadEndFiller } from './solver/dead-end-filler.js';
import { DeadEndRemover } from './solver/dead-end-remover.js';
import { DepthFirstSearch } from './solver/depth-first-search.js';
import { type MazeSolver, type MazeSolverProperties } from './solver/maze-solver.js';
import { WallWalking } from './solver/wall-walking.js';

const mazes: Record<string, (props: MazeProperties) => Maze> = {
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
  const [selectedMaze, setSelectedMaze] = React.useState<MazeType>('brick');

  const handleMazeChange = React.useCallback((event: SelectChangeEvent): void => {
    setSelectedMaze(event.target.value);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      <div style={{ backgroundColor: 'lightBlue' }}>
        <MazeBoard
          boxWidth={500}
          boxHeight={500}
          maze={selectedMaze}
          style={{ margin: 10, border: '1px solid magenta' }}
        />
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
      </div>
    </div>
  );
};

const algorithms: Record<string, (props: MazeGeneratorProperties) => MazeGenerator> = {
  blob: (props) => new Blob(props),
  growingTree: (props) => new GrowingTree(props),
  kruskals: (props) => new Kruskals(props),
  prims: (props) => new Prims(props),
  recursizeBacktracker: (props) => new RecursiveBacktracker(props),
  wilsons: (props) => new Wilsons(props),
};

const solvers: Record<string, (props: MazeSolverProperties) => MazeSolver> = {
  depthFirstSearch: (props) => new DepthFirstSearch(props),
  deadEndFiller: (props) => new DeadEndFiller(props),
  deadEndRemover: (props) => new DeadEndRemover(props),
  followTheRightWall: (props) => new WallWalking({ ...props, turn: 'right' }),
  followTheLeftWall: (props) => new WallWalking({ ...props, turn: 'left' }),
  breadthFirstSearch: (props) => new BreadthFirstSearch(props),
};

type MazeBoardProps = {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly maze: MazeType;
  readonly boxWidth: number;
  readonly boxHeight: number;
  readonly children?: never;
};

export const MazeBoard: React.FC<MazeBoardProps> = ({
  className,
  style,
  boxWidth,
  boxHeight,
  maze,
}) => {
  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (canvasMaze.current) {
      const contextMaze = new Drawing(canvasMaze.current);

      const factory = new MazeFactory({ drawing: contextMaze });

      void factory.create(mazes[maze]).then((m) => {
        for (let i = 0; i < 2; ++i) {
          let j = i;
          for (const direction of m.directions) {
            m.drawPath({ y: i, x: j++, direction });
          }
        }
      });
    }
  }, [boxHeight, boxWidth, maze]);

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

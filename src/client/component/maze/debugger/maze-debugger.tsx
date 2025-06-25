import React from 'react';

import { MenuItem, NumberField, Select } from '#control';

import { CanvasDrawing } from '../drawing/canvas-drawing.ts';
import { MazeFactory } from '../factory/maze-factory.ts';
import {
  BrickMaze,
  CircularMaze,
  CubicMaze,
  HexagonMaze,
  type Maze,
  type MazeProperties,
  OctogonMaze,
  PentagonMaze,
  SquareMaze,
  TriangleMaze,
  WedgeMaze,
  ZetaMaze,
} from '../geometry/index.ts';

const mazes: Record<string, (props: MazeProperties) => Maze> = {
  circular: (props) => new CircularMaze(props),
  cubic: (props) => new CubicMaze(props),
  pentagon: (props) => new PentagonMaze(props),
  brick: (props) => new BrickMaze(props),
  square: (props) => new SquareMaze(props),
  triangle: (props) => new TriangleMaze(props),
  hexagon: (props) => new HexagonMaze(props),
  octogon: (props) => new OctogonMaze(props),
  wedge: (props) => new WedgeMaze(props),
  zeta: (props) => new ZetaMaze(props),
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
  const [pillar, setPillar] = React.useState('ab');
  const [maze, setMaze] = React.useState<Maze>();
  const [errors, setErrors] = React.useState<string[]>([]);
  const [cellSize, setCellSize] = React.useState<number>();
  const [wallSize, setWallSize] = React.useState<number>();

  const handleMazeChange = React.useCallback((value: string): void => {
    setWallSize(undefined);
    setCellSize(undefined);
    setX(0);
    setY(0);
    setSelectedMaze(value);
  }, []);

  const handleShowChange = React.useCallback((value: string): void => {
    setShow(value);
  }, []);

  const handleXChange = React.useCallback((value: number): void => {
    setX(value);
  }, []);

  const handleYChange = React.useCallback((value: number): void => {
    setY(value);
  }, []);

  const handleWallChange = React.useCallback((value: string): void => {
    setWall(value);
  }, []);

  const handlePillarChange = React.useCallback((value: string): void => {
    setPillar(value);
  }, []);

  const handleRemoveWalls = React.useCallback(() => {
    if (maze) {
      maze.removeInteriorWalls();
      maze.draw();
    }
  }, [maze]);

  const handleCreateCells = React.useCallback(() => {
    if (maze) {
      maze.createCells();
      maze.draw();
    }
  }, [maze]);

  const handleCellSizeChange = React.useCallback((value: number): void => {
    setCellSize(value === 0 ? undefined : value);
  }, []);

  const handleWallSizeChange = React.useCallback((value: number): void => {
    setWallSize(value === 0 ? undefined : value);
  }, []);

  const canvasMaze = React.useRef<HTMLCanvasElement | null>(null);

  const boxWidth = 500;
  const boxHeight = 800;

  React.useEffect(() => {
    if (canvasMaze.current) {
      const contextMaze = new CanvasDrawing(canvasMaze.current);

      const factory = new MazeFactory({ drawing: contextMaze, cellSize, wallSize });

      const runner = factory.create(mazes[selectedMaze]);

      void runner.run().then((m) => {
        setMaze(m);
      });
    }
  }, [selectedMaze, cellSize, wallSize]);

  React.useEffect(() => {
    if (maze) {
      maze.draw();
      switch (show) {
        case 'walls': {
          for (let i = 0; i < maze.width; ++i) {
            for (let j = 0; j < maze.height; ++j) {
              if (maze.nexus({ x: i, y: j }).walls[wall]) {
                maze.drawWall({ x: i, y: j, direction: wall }, 'magenta');
              }
            }
          }

          break;
        }

        case 'pillars': {
          for (let i = 0; i < maze.width; ++i) {
            for (let j = 0; j < maze.height; ++j) {
              const w = maze.nexus({ x: i, y: j }).walls;

              if (pillar[0] in w && pillar[1] in w) {
                maze.drawPillar({ x: i, y: j }, pillar, 'magenta');
              }
            }
          }

          break;
        }

        case 'coordinates': {
          for (let i = 0; i < maze.width; ++i) {
            for (let j = 0; j < maze.height; ++j) {
              maze.drawText(maze.drawCell({ x: i, y: j }), `${i},${j}`, 'lime');
            }
          }
          maze.drawX(maze.drawCell({ x, y }), 'red');
          break;
        }

        default: {
          maze.drawX(maze.drawCell({ x, y }), 'red');
          const moves = maze.moves({ x, y }, { wall: 'all' });
          for (const move of moves) {
            switch (show) {
              case 'moves': {
                maze.drawText(maze.drawCell(move.move), move.direction, 'cyan');
                break;
              }
              case 'paths': {
                maze.drawPath(
                  maze.drawCell({ ...move.move, direction: maze.opposite(move.move) }),
                  'cyan',
                );
                break;
              }

              // no default
            }
          }
          break;
        }
      }
    }
  }, [maze, selectedMaze, show, x, y, wall, pillar]);

  React.useEffect(() => {
    const err: string[] = [];

    if (maze) {
      for (const cell of maze.cellsInMaze()) {
        for (const direction of Object.keys(maze.nexus(cell).walls)) {
          const move = maze.move(cell, direction);
          if (maze.inMaze(move)) {
            const back = maze.move(move, maze.opposite(move));
            if (back) {
              if (cell.x !== back.x || cell.y !== back.y) {
                err.push(
                  `{ x: ${cell.x}, y: ${cell.y}, direction: ${direction}} = { x: ${move.x}, y: ${move.y}, direction: ${maze.opposite(move)} }; back = { x: ${back.x}, y: ${back.y}}`,
                );
              }
            } else {
              err.push(
                `{ x: ${cell.x}, y: ${cell.y}, direction: ${direction}} = { x: ${move.x}, y: ${move.y}, direction: ${maze.opposite(move)} }; back = NULL`,
              );
            }

            const rt = maze.rightTurn(move);
            const lt = maze.leftTurn(move);

            const ltr = [...lt.slice(0, -1).reverse(), lt.at(-1)];

            if (rt.some((t, i) => t !== ltr.at(i))) {
              err.push(
                `{ x: ${move.x}, y: ${move.y}, direction: ${move.direction}}: rt[${rt.join(',')}] != lt[${lt.join(';')} --- ${ltr.join(',')}]`,
              );
            }
          }
        }
      }

      for (const cell of maze.cellsInMaze()) {
        for (const move of maze.moves(cell, { wall: 'all' })) {
          const back = maze.move(move.move, maze.opposite(move.move));
          if (back) {
            if (cell.x !== back.x || cell.y !== back.y) {
              err.push(
                `{ x: ${cell.x}, y: ${cell.y}, direction: ${move.direction}} = { x: ${move.move.x}, y: ${move.move.y} } back = { x: ${back.x}, y: ${back.y}, ${maze.opposite(move.move)} }`,
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
      <div style={{ backgroundColor: 'white' }}>
        <div
          style={{
            position: 'relative',
            width: boxWidth,
            height: boxHeight,
            backgroundColor: 'lightBlue',
          }}
        >
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
        <Select value={selectedMaze} label="Maze" onChange={handleMazeChange}>
          {Object.keys(mazes).map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
        <br />
        <NumberField
          value={cellSize ?? 0}
          label="Cell Size"
          onChange={handleCellSizeChange}
          min={0}
          max={100}
        />
        <NumberField
          value={wallSize ?? 0}
          label="Wall Size"
          onChange={handleWallSizeChange}
          min={0}
          max={100}
        />
        <br />
        <Select value={show} label="Show" onChange={handleShowChange}>
          <MenuItem value="moves">Moves</MenuItem>
          <MenuItem value="paths">Paths</MenuItem>
          <MenuItem value="walls">Walls</MenuItem>
          <MenuItem value="coordinates">Coordinates</MenuItem>
          <MenuItem value="pillars">Pillars</MenuItem>
        </Select>
        <br />
        <br />
        <NumberField
          value={x}
          label="X"
          onChange={handleXChange}
          min={0}
          max={(maze?.width ?? 0) - 1}
        />
        <NumberField
          value={y}
          label="Y"
          onChange={handleYChange}
          min={0}
          max={(maze?.height ?? 0) - 1}
        />
        <br />
        {show === 'walls' && (
          <Select value={wall} label="Wall" onChange={handleWallChange}>
            {maze?.directions.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        )}
        {show === 'pillars' && (
          <Select value={pillar} label="Pillar" onChange={handlePillarChange}>
            {maze?.pillars.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        )}
        <br />
        <button type="button" onClick={handleRemoveWalls}>
          Remove walls
        </button>
        <button type="button" onClick={handleCreateCells}>
          Create walls
        </button>
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

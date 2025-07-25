import React from 'react';

import { Button, MenuItem, NumberField, Select } from '#control';
import { CanvasDrawing } from '#maze/drawing';
import {
  BrickMaze,
  CircularMaze,
  CubicMaze,
  type Direction,
  DotMaze,
  HexagonMaze,
  type Maze,
  type MazeProperties,
  OctagonDiamond,
  OctagonSquare,
  PentagonMaze,
  type Pillar,
  SquareMaze,
  TriangleMaze,
  WedgeMaze,
  ZetaMaze,
} from '#maze/geometry';
import { Runner } from '#maze/runner';

const mazes: Record<string, (props: MazeProperties) => Maze> = {
  circular: (props) => new CircularMaze(props),
  cubic: (props) => new CubicMaze(props),
  dot: (props) => new DotMaze(props),
  pentagon: (props) => new PentagonMaze(props),
  brick: (props) => new BrickMaze(props),
  square: (props) => new SquareMaze(props),
  triangle: (props) => new TriangleMaze(props),
  hexagon: (props) => new HexagonMaze(props),
  octagonDiamond: (props) => new OctagonDiamond(props),
  octagonSquare: (props) => new OctagonSquare(props),
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
  const [wall, setWall] = React.useState<Direction>('a');
  const [pillar, setPillar] = React.useState<Pillar>('ab');
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
    setWall(value as Direction);
  }, []);

  const handlePillarChange = React.useCallback((value: string): void => {
    setPillar(value as Pillar);
  }, []);

  const handleRemoveWalls = React.useCallback(() => {
    if (maze) {
      maze.removeInteriorWalls();
      maze.draw();
    }
  }, [maze]);

  const handleCreateCells = React.useCallback(() => {
    if (maze) {
      maze.createNexus();
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

      const runner = new Runner({
        mazeMaker: (props) => mazes[selectedMaze]({ cellSize, wallSize, ...props }),
        drawing: contextMaze,
      });

      setMaze(runner.maze);
      runner.draw();
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
                maze.drawWall({ x: i, y: j }, wall, 'magenta');
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
                maze.drawText(maze.drawCell(move.target), move.direction, 'cyan');
                break;
              }
              case 'paths': {
                maze.drawPath(
                  maze.drawCell({ ...move.target, direction: maze.opposite(move.target.facing) }),
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
        for (const direction of Object.keys(maze.nexus(cell).walls) as Direction[]) {
          const move = maze.move(cell, direction);
          if (maze.inMaze(move)) {
            const back = maze.move(move, maze.opposite(move.facing));
            if (back) {
              if (cell.x !== back.x || cell.y !== back.y) {
                err.push(
                  `{ x: ${cell.x}, y: ${cell.y}, direction: ${direction}} = { x: ${move.x}, y: ${move.y}, direction: ${maze.opposite(move.facing)} }; back = { x: ${back.x}, y: ${back.y}}`,
                );
              }
            } else {
              err.push(
                `{ x: ${cell.x}, y: ${cell.y}, direction: ${direction}} = { x: ${move.x}, y: ${move.y}, direction: ${maze.opposite(move.facing)} }; back = NULL`,
              );
            }

            const rt = maze.rightTurn(move);
            const lt = maze.leftTurn(move);

            const ltr = [...lt.slice(0, -1).reverse(), lt.at(-1)];

            if (rt.some((t, i) => t !== ltr.at(i))) {
              err.push(
                `{ x: ${move.x}, y: ${move.y}, facing: ${move.facing}}: rt[${rt.join(',')}] != lt[${lt.join(';')} --- ${ltr.join(',')}]`,
              );
            }
          }
        }
      }

      for (const cell of maze.cellsInMaze()) {
        for (const move of maze.moves(cell, { wall: 'all' })) {
          const back = maze.move(move.target, maze.opposite(move.target.facing));
          if (back) {
            if (cell.x !== back.x || cell.y !== back.y) {
              err.push(
                `{ x: ${cell.x}, y: ${cell.y}, direction: ${move.direction}} = { x: ${move.target.x}, y: ${move.target.y} } back = { x: ${back.x}, y: ${back.y}, ${maze.opposite(move.target.facing)} }`,
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
        <Button type="button" onClick={handleRemoveWalls}>
          Remove walls
        </Button>
        <Button type="button" onClick={handleCreateCells}>
          Create walls
        </Button>
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

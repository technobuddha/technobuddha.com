import React                            from 'react';
import randomPick                       from '@technobuddha/library/randomPick';
import { Size }                         from '@technobuddha/mui-size';
import { MazeFactory }                  from './maze/MazeFactory';

import type { Maze, MazeProperties }    from './maze/Maze';
import type { MazeSolver, MazeSolverProperties }    from './solver/MazeSolver';

import SquareMaze           from './maze/SquareMaze';
import TriangleMaze         from './maze/TriangleMaze';
import HexagonMaze          from './maze/HexagonMaze';

import Kruskals             from './generator/Kruskals';
import RecursiveBacktracker from './generator/RecursiveBacktracker';
//import RecursiveDivision    from './generator/RecursiveDivision';
import TruePrims            from './generator/TruePrims';
import Blob                 from './generator/Blob';
import GrowingTree          from './generator/GrowingTree';
import Wilsons              from './generator/Wilsons';

import DeadEndFiller        from './solver/DeadEndFiller';
import WallWalking          from './solver/WallWalking';
import DepthFirstSearch     from './solver/DepthFirstSearch';
import BreadthFirstSearch   from './solver/BreadthFirstSearch';

type MazeMakerProps = {
    children?: never;
};

export const MazeMaker: React.FC<MazeMakerProps> = () => {
    return (
        <Size width="100%" height="100%">
            {
                ({ width, height }) =>
                    <MazeBoard boxWidth={width} boxHeight={height} />
            }
        </Size>
    );
};

type MazeBoardProps = {
    boxWidth: number;
    boxHeight: number;
    children?: never;
};

const mazes: ((props: MazeProperties) => Maze)[] = [
    (props: MazeProperties) => new SquareMaze(props),
    (props: MazeProperties) => new TriangleMaze(props),
    (props: MazeProperties) => new HexagonMaze(props),
];

const algorithms = [
    Kruskals,
    RecursiveBacktracker,
    TruePrims,
    Blob,
    GrowingTree,
    Wilsons,
    // RecursiveDivision,
];

const solvers: ((props: MazeSolverProperties) => MazeSolver)[] = [
    (props: MazeSolverProperties) => new DepthFirstSearch(props),
    (props: MazeSolverProperties) => new DeadEndFiller(props),
    (props: MazeSolverProperties) => new WallWalking(props),
    (props: MazeSolverProperties) => new BreadthFirstSearch(props),
];

export const MazeBoard: React.FC<MazeBoardProps> = ({ boxWidth, boxHeight }) => {
    const canvasMaze        = React.useRef<HTMLCanvasElement | null>(null);
    const canvasSolve1      = React.useRef<HTMLCanvasElement | null>(null);
    const canvasSolve2      = React.useRef<HTMLCanvasElement | null>(null);
    const [ redraw, setRedraw ]   = React.useState(0);

    React.useEffect(
        () => {
            if(canvasMaze.current && canvasSolve1.current && canvasSolve2.current) {
                const contextMaze   = canvasMaze.current.getContext('2d')!;
                const contextSolve1 = canvasSolve1.current.getContext('2d')!;
                const contextSolve2 = canvasSolve2.current.getContext('2d')!;

                const factory = new MazeFactory({ context: contextMaze });

                contextSolve1.clearRect(0, 0, boxWidth, boxHeight);
                contextSolve2.clearRect(0, 0, boxWidth, boxHeight);

                void factory.create(
                    randomPick(mazes)!,
                    randomPick(algorithms)!,
                    10
                )
                .then(maze => {
                    maze.draw();
                    setTimeout(() => {
                        //maze.drawDistances();
                        // eslint-disable-next-line promise/no-nesting
                        void randomPick(solvers)!({ maze, context: contextSolve1 }).solve({})
                        .then(() => {
                            setTimeout(
                                () => { setRedraw(x => x + 1); },
                                5000
                            );
                        });
                    }, 0);
                });
            }
        },
        [ redraw ]
    );

    return (
        <div style={{ position: 'relative' }}>
            <canvas ref={canvasMaze} width={boxWidth} height={boxHeight} style={{ position: 'absolute', zIndex: 1 }} />
            <canvas ref={canvasSolve1} width={boxWidth} height={boxHeight} style={{ position: 'absolute', zIndex: 2 }} />
            <canvas ref={canvasSolve2} width={boxWidth} height={boxHeight} style={{ position: 'absolute', zIndex: 3 }} />
        </div>
    );
};

export default MazeMaker;

import type { Maze, CellDirection } from '../maze/Maze';

export type MazeSolverProperties =  {
    maze: Maze;
    context: CanvasRenderingContext2D;
};

export type SolveArguments = {
    color?: string;
    entrance?: CellDirection;
    exit?: CellDirection;
};

export abstract class MazeSolver  {
    protected maze:     MazeSolverProperties['maze'];
    protected context:  MazeSolverProperties['context'];

    constructor({ maze, context }: MazeSolverProperties) {
        this.maze       = maze;
        this.context    = context;
    }

    public abstract solve({ color, entrance, exit }: SolveArguments): Promise<void>;
}

export default MazeSolver;

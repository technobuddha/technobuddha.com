This is a single developer project written by Phil Hill, you can call me Phil.
There are two major parts to this project, server-side and client-side.
The server-side uses Node.js and express.js to create a REST API that serves the client-side application.
The client-side is a React application.
Both sides are written in TypeScript.   Using Prettier and ESLint for code formatting and linting.
Both Prettier and ESLint are controlled by an external project names @technobuddha/project, also written by me.
Rules from @technobuddha/project can be overridden in the local technobuddha.config.js file.
@technobuddha/project also controls the Typesctipt configuration and the Jest configuration.
While Jest is configured, there are no unit tests in this project.
Code is built and debugged usint vite, server-side code in integrated into vite using vite-express.
Right now I'm focusing on the maze portion on the client project.
Consider any code under an `archive` directory to be historical and not relevant to the current project.
All maze code is in the `src/components.maze` directory.
Maze geometeries are under `src/components/maze/geometry`.
Maze generation is under `src/components/maze/generator`.
Maze solvings is under `src/components/maze/solver`.

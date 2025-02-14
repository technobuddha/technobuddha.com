#!/bin/env -S ts-node -r ./config/env.ts -r tsconfig-paths/register
import path                       from 'path';
import webpack                    from 'webpack';
import chalk                      from 'chalk';
import { spawn }                  from 'child_process';
import repeat                     from 'lodash/repeat';
import { genServerWebpackConfig } from '#server/webpack.config';
import paths                      from '#config/paths';
import type { ChildProcess } from 'child_process';

chalk.level = 3;    // Tell chalk that we support full RGB colors
const esc = '\u001b';
let serverProcess: ChildProcess | null = null;

const startServer   = () => {
    if(serverProcess) {
        out(chalk.red('\nServer changed, restarting...\n\n'));
        stopServer();
    }

    serverProcess = spawn('node', [ path.join(paths.bin, 'server.js') ], { stdio: 'inherit' });
};

const stopServer    = () => {
    if(serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
};

const exit = () => {
    stopServer();
    process.exit(0);
};

for(const sig of [ 'SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit', 'uncaughtexception' ])
    process.on(sig, exit);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err: Error) => {
    throw err;
});

webpack(genServerWebpackConfig(true)).watch(
    {},
    (error: Error | null, stats: webpack.Stats) => {
        if(error ?? stats.hasErrors())
            process.stdout.write(`${stats.toString('errors-only')}\n`);
        else
            startServer();
    }
);

const { width } = screenSize();

clearScreen();
out(header());
out(`${repeat('=', width)}\n`);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function out(text: string) {
    process.stdout.write(text);
}

function clearScreen() {
    out(process.platform === 'win32' ? `${esc}[2J${esc}[0f` : `${esc}[2J${esc}[3J${esc}[H`);
}

function screenSize() {
    return {
        height: process.stdout.rows,
        width:  process.stdout.columns,
    };
}

//#region Logo
function header() {
    const logo = [
        chalk.hex('#d0f2fa')('▄██▄'),
        chalk.hex('#a3e1f6')('▄██████▄'),
        chalk.hex('#70c0e4')('▄██████████▄'),
        chalk.hex('#4b98ca')('▄██████████████▄'),
        chalk.hex('#1b5ca8')('▄██████████████████▄'),
        chalk.hex('#135490')('▄██████████████████████▄'),
        chalk.hex('#0d3f78')('▄██████████████████████████▄'),
        chalk.hex('#082c61')('▄██████████████████████████████▄'),
        chalk.hex('#051f50')('▄██████████████████████████████████▄'),
    ];

    const name = [
        '',
        '',
        'H     H  IIIII  L      L           SSSSS    OOOO   FFFFFF  TTTTT  W     W    AA    RRRRR   EEEEEE',
        'H     H    I    L      L          S        O    O  F         T    W     W   A  A   R    R  E     ',
        'H     H    I    L      L          S        O    O  F         T    W  W  w  A    A  R    R  E     ',
        'HHHHHHH    I    L      L           SSSSS   O    O  FFF       T    W  W  W  AAAAAA  RRRRR   EEE   ',
        'H     H    I    L      L                S  O    O  F         T    W W W W  A    A  R R     E     ',
        'H     H    I    L      L      ..        S  O    O  F         T    W W W W  A    A  R   R   E     ',
        'H     H  IIIII  LLLLL  LLLLL  ..   SSSSS    OOOO   F         T     W   W   A    A  R    R  EEEEEE',
    ];

    let output = '';
    for(const [ i, element ] of logo.entries()) {
        for(let j = 8; j > i; --j)
            output += '  ';

        output += element;
        for(let j = 8; j > i; --j)
            output += '  ';

        output += `   ${name[i]}\n`;
    }
    return output;
}
//#endregion

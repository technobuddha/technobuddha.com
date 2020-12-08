#!/usr/bin/env ts-node

import process                      from 'process';
import webpack                      from 'webpack';
import commandLineArgs              from 'command-line-args';
import commandLineUsage             from 'command-line-usage';
import chalk                        from 'chalk';
import repeat                       from 'lodash/repeat';
import { spawn, ChildProcess }      from 'child_process';
import { genServerWebpackConfig }   from '../src/server/webpack.config';
import { genClientWebpackConfig }   from '../src/client/webpack.config';

chalk.level = 3;    // Tell chalk that we support full RGB colors

//#region Terminal functions
const esc   = '\u001b';

function out(text: string) {
    process.stdout.write(text);
}

function clearScreen() {
    out(`${esc}[2J`);
}

function setScrollRegion(begin?: number, end?: number) {
    if(begin && end) 
        out(`${esc}[${begin};${end}r`);
    else
        out(`${esc}[r`);
}

function moveCursorTo(x: number, y: number) {
    out(`${esc}[${y};${x}H`);
}
//#endregion
//#region Logo
const HEADER_HEIGHT = 9;
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
    ]

    const name = [
        '',
        '',
        'H     H  IIIIIII   L         L',
        'H     H     I      L         L',
        'H     H     I      L         L',
        'HHHHHHH     I      L         L',
        'H     H     I      L         L',
        'H     H     I      L         L',
        'H     H  IIIIIII   LLLLLLL   LLLLLLL',
    ]

    let output = "";
    for(let i = 0; i < logo.length; ++i) {
        for(let j = 8; j > i; --j) {
            output += '  '
        }
        output += logo[i];
        for(let j = 8; j > i; --j) {
            output += '  '
        }
        output += '   ' + name[i] + '\n';
    }
    return output;
}
//#endregion
//#region Command Line Parsing
const options: commandLineArgs.CommandLineOptions = commandLineArgs(
    [{
        name:           'target',
        alias:          't',
        defaultOption:  true,
        defaultValue:   'development',
        type:           (target: string) => {
            if(target === 'development' || target === 'production')
                return target;
            else
                throw Error('--target must be one of "development" or "production"');
        },
    },
    {
        name:           'help',
        alias:          'h',
        type:           Boolean,
    }],
    { stopAtFirstUnknown: true }
);

if(options.help) {
    out(
        commandLineUsage([
            {
                content: header(),
                raw: true,
            },
            {
                header: 'Technobuddha development tool',
                content: 'A tool for debugging and deploying Technobuddha\'s web application',
            },
            {
                header: 'Options',
                optionList: [
                    {
                        name: 'target, -t',
                        typeLabel: '{bold development} | {bold production}',
                        description: 'The build target'
                    },
                    {
                        name: 'help, -h',
                        typeLabel: ' ',
                        description: 'Display this usage guide.'
                    }
                ]
            }
        ])
    );
    process.exit(0);
}
//#endregion

if(options.target === 'development') {
    let   height                                      = process.stdout.rows;
    let   width                                       = process.stdout.columns;
    let   serverProcess: ChildProcess | null          = null;

    if(height && width) {
        clearScreen();
        setScrollRegion(HEADER_HEIGHT + 2, height);   // +1 for the row of ===, +1 to begin after the logo
        out(header());
        out(`${repeat('.', width)}\n`);
        moveCursorTo(1, height);

        process.stdout.on(
            'resize',
            () => {
                height = process.stdout.rows;
                width  = process.stdout.columns;

                clearScreen();
                setScrollRegion();
                moveCursorTo(1, 1);
                out(header());
                out(`${repeat('=', width)}\n`);
                setScrollRegion(HEADER_HEIGHT + 2, height);
                moveCursorTo(1, height);
            }
        );
    }

    const startServer   = () => {
        if(serverProcess) {
            out(chalk.red(`Server changed, restarting...\n`));
            stopServer();
        }

        serverProcess = spawn('node', ['./bin/server.js']);
        serverProcess?.stdout?.on('data', out);
        serverProcess?.stderr?.on('data', out);
    }
    
    const stopServer    = () => {
        if(serverProcess) {
            serverProcess.kill();
            serverProcess = null;
        }
    }
    
    const exit = () => {
        stopServer();

        setScrollRegion();
        moveCursorTo(1, height);
        process.exit(0);
    }


    process.on('SIGINT', exit);
    process.on('SIGTERM', exit);
    process.on('SIGHUP', exit);
    process.on('SIGQUIT', exit);
    process.on('exit', exit);
    process.on('uncaughtException', exit);

    clearScreen();
    setScrollRegion(HEADER_HEIGHT+2, height);
    out(header());
    out(`${repeat('=', width)}\n`)

    webpack(genServerWebpackConfig(true)).watch(
        {},
        (error: Error, stats: webpack.Stats) => {
           stopServer();
           if(error ?? stats.hasErrors())
               process.stdout.write(`${stats.toString('errors-only')}\n`);
           else
               startServer();
        }
    );

} else {
    webpack(
        genServerWebpackConfig(false),
        (_error: Error, _stats: webpack.Stats) => {
            out('--client');
            webpack(
                genClientWebpackConfig(false),
                (_error: Error, _stats: webpack.Stats) => {
                    out('--done');
                }
            )
        }
    );
}



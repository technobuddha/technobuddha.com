import chalk        from 'chalk';
import winston      from 'winston';
import { space }    from '@technobuddha/library/constants';

import type { Logger } from 'winston';

export function createLogger(isDevelopment: boolean): Logger {
    const logLevel = (level: string) => {
        let colored: string;

        switch(level) {
            case 'error':   colored = chalk.red(level);     break;
            case 'warn':    colored = chalk.yellow(level);  break;
            case 'info':    colored = chalk.cyan(level);    break;
            case 'http':    colored = chalk.blue(level);    break;
            case 'verbose': colored = chalk.green(level);   break;
            case 'debug':   colored = chalk.magenta(level); break;
            case 'silly':
            default:        colored = level;                break;
        }
        return `${colored}${space.repeat(7 - level.length)}`;
    };

    return winston.createLogger({
        level:          isDevelopment ? 'silly' : 'verbose',
        format:         winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(info => `${info.timestamp} ${logLevel(info.level)} ${info.message}`),
        ),
        transports:     [
            new winston.transports.Console(),
            new winston.transports.File({ filename: '/var/log/technobuddha/server.log' }),
        ],
    });
}

export default createLogger;

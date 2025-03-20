import chalk                        from 'chalk';
import webpack                      from 'webpack';
import devMiddleware                from 'webpack-dev-middleware';
import hotMiddleware                from 'webpack-hot-middleware';
import { genClientWebpackConfig }   from '#client/webpack.config';

import type { Logger }      from 'winston';
import type { Application } from 'express';

export function development(app: Application, logger: Logger): void {
    const clientWebpackConfig   = genClientWebpackConfig(true, logger);
    const compiler              = webpack(clientWebpackConfig);

    // @ts-expect-error The type definition for compiler.hooks is missing the infrastructureLog property
    compiler.hooks.infrastructureLog.tap(
        'server',
        (name: string, type: string, args: string[]) => {
            if(type === 'error' || type === 'warn' || type === 'info' || type === 'debug') {
                for(const arg of args)
                    logger[type](`[${chalk.yellow(name)}] ${arg}`);
                return false;
            }
            return true;
        }
    );

    app.use(
        devMiddleware(
            compiler as any,
            {
                publicPath: clientWebpackConfig.output?.publicPath ?? '/dist',
            }
        )
    )
    .use(
        hotMiddleware(
            compiler,
            {
                log: (message: string) => logger.debug(`[${chalk.yellow('webpack-hot-middleware')}] ${message}`),
            }
        )
    );
}

export default development;

import TsConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import nodeExternals       from 'webpack-node-externals';
import paths               from '#config/paths';

import type Webpack from 'webpack';

const extensions    = [ '.ts', '.tsx', '.js', '.json', '.css', '.pcss' ];

export const genServerWebpackConfig: ((isDevelopment?: boolean) => Webpack.Configuration) = (isDevelopment = true) => {
    return {
        name:   'server',
        mode:   isDevelopment ? 'development' : 'production',
        entry: {
            'server': paths.serverEntry,
        },
        output: {
            filename:   '[name].js',
            path:       paths.bin,
        },
        module: {
            rules: [
                {
                    test:       /\.ts?$/u,
                    loader:     'ts-loader',
                    options:    {
                        transpileOnly: true,
                    },
                    exclude:    /node-modules/u,
                },
            ],
        },
        resolve: {
            extensions,
            plugins:        [ new TsConfigPathsPlugin({ extensions }) ],
        },
        optimization:   { minimize: !isDevelopment },
        devtool:        isDevelopment ? 'source-map' : false,
        target:         'node',
        externals:      [ nodeExternals() ],
        performance:    { hints: false },
        stats:          'normal',
        node:           { __dirname: false, __filename: true },
    };
};

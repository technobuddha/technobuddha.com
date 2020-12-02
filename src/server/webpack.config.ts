import path                         from 'path';
import webpack                      from 'webpack';
import TsConfigPathsPlugin          from 'tsconfig-paths-webpack-plugin';
import nodeExternals                from 'webpack-node-externals';
import paths                        from 'config/paths';

const extensions    = [ '.ts', '.tsx', '.js', '.json', '.css', '.pcss' ];

export const genServerWebpackConfig: ((isDevelopment?: boolean) => webpack.Configuration) = (isDevelopment = true) => {
    return {
        name:   'server',
        mode:   isDevelopment ? 'development' : 'production',
        entry: {
            'server': path.join(paths.home, 'src', 'server', 'server.ts')       // TODO use paths
        },
        output: {
            filename:   '[name].js',
            path:       path.join(paths.home, 'bin'),
        },
        module: {
            rules: [
                {
                    test:       /\.ts?$/,
                    loader:     'ts-loader',
                    options:    { 
                        transpileOnly: true,
                    },
                    exclude:    /node-modules/,
                },
            ],
        },
        resolve: {
            extensions,
            plugins:        [ new TsConfigPathsPlugin({extensions}) ],
        },
        optimization:   { minimize: !isDevelopment, },
        devtool:        isDevelopment ? 'source-map' : false,
        target:         'node',
        externals:      [ nodeExternals() ],
        performance:    { hints: false },
        stats:          'normal',
        node:           { __dirname: false, __filename: true },
    }
};

export const developmentWebpackConfig = genServerWebpackConfig();

export default developmentWebpackConfig;

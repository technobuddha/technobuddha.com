import webpack               from 'webpack';
import mapValues             from 'lodash/mapValues';
import omitBy                from 'lodash/omitBy';
import isNil                 from 'lodash/isNil';
import compact               from 'lodash/compact';
import MiniCssExtractPlugin  from 'mini-css-extract-plugin';
import TsConfigPathsPlugin   from 'tsconfig-paths-webpack-plugin';
import externalPackages      from '#config/external-packages';
import paths                 from '#config/paths';
import { CMTDWebpackPlugin } from 'css-module-type-definitions';
import postcss_config        from '#config/postcss.config';
import type { Logger }       from 'css-module-type-definitions';
//import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const extensions    = [ '.ts', '.tsx', '.js', '.json', '.css', '.pcss' ];

export function genClientWebpackConfig(isDevelopment = true, logger?: Logger): webpack.Configuration {
    return {
        name:   'client',
        // https://webpack.js.org/concepts/mode/
        mode:       isDevelopment ? 'development' : 'production',
        // https://webpack.js.org/configuration/entry-context/#entry
        entry: {
            main:   compact([
                (isDevelopment ? paths.webpackHotMiddlewareClient : null),
                paths.clientEntry,
            ]),
        },
        // https://webpack.js.org/configuration/output/
        output: {
            filename:       '[name].js',
            chunkFilename:  '[name].js',
            publicPath:     '/dist/',
            path:           paths.dist,
        },
        // https://webpack.js.org/configuration/module/
        module: {
            rules: [
                {
                    test:       /\.tsx?$/,
                    loader:     'ts-loader',
                    options:    {
                        transpileOnly: true 
                    },
                    exclude:    /node-modules/,
                },
                {
                    test:       /\.pcss$/,
                    use: [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    compileType:                'module',
                                    mode:                       'local',
                                    auto:                       /\.pcss$/,
                                    exportGlobals:              true,
                                    localIdentName:             isDevelopment ? '[local]-[path][name]' : '[hash:base64]',
                                    localIdentContext:          paths.client,
                                    localIdentHashPrefix:       'technobuddha',
                                    exportLocalsConvention:     'camelCase',
                                    exportOnlyLocals:           false,
                                },
                                sourceMap:          true,
                                importLoaders:      1,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: postcss_config,
                            }
                        },
                    ],
                },
                {
                    test:       /\.(ttf|eot|svg|png|jpg|gif|ico)$/,
                    loader:     'file-loader'
                },
                {
                    enforce:    'pre',
                    test:       /\.js$/,
                    loader:     'source-map-loader',
                },
            ],
        },
        // https://webpack.js.org/configuration/resolve/
        resolve: {
            extensions,
            plugins:        [ new TsConfigPathsPlugin({extensions}) ],
        },
        // https://webpack.js.org/configuration/optimization/
        optimization: {
            minimize:                   !isDevelopment,
            splitChunks: {
                chunks:                 'all',
                automaticNameDelimiter: '-',
                cacheGroups: {
                    packages: {
                        test:           /[\\/]node_modules[\\/]/,
                        priority:       1,
                    },
                },
            },
            namedModules: true,
        },
        // https://webpack.js.org/configuration/devtool/
        devtool:        isDevelopment ? 'source-map' : false,
        // https://webpack.js.org/configuration/target/
        target:         'web',
        // https://webpack.js.org/configuration/externals/
        externals:      mapValues(omitBy(externalPackages, v => isNil(v.global)), v => v.global) as Record<string, string>,
        // https://webpack.js.org/configuration/performance/
        performance:    { hints: false },
        // https://webpack.js.org/configuration/stats/
        stats:          false,
        // https://webpack.js.org/configuration/plugins/
        plugins:         compact([
            new MiniCssExtractPlugin({
                filename:           '[name].css',
                chunkFilename:      '[id].css',
            }),
            (isDevelopment ? new CMTDWebpackPlugin({ inputDirectoryName: paths.src, globPattern: '**/*.pcss', camelCase: true, logger, config: postcss_config }) : null),
            (isDevelopment ? new webpack.HotModuleReplacementPlugin()                                                                    : null),
            //(isDevelopment ? new BundleAnalyzerPlugin()                                                                                  : null),
        ]),
    }
}

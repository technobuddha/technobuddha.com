import path                     from 'path';
import webpack                  from 'webpack';
import mapValues                from 'lodash/mapValues';
import omitBy                   from 'lodash/omitBy';
import isNil                    from 'lodash/isNil';
import compact                  from 'lodash/compact';
import { Dictionary }           from 'lodash';
import MiniCssExtractPlugin     from 'mini-css-extract-plugin';
import { TsConfigPathsPlugin }  from 'awesome-typescript-loader';
import externalPackages         from '../external-packages';
import { CMTDWebpackPlugin }    from 'css-module-type-definitions';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const home = path.normalize(path.join(__dirname, '..'));

export function genClientWebpackConfig(isDevelopment = true): webpack.Configuration {
    return {
        name:   'client',
        // https://webpack.js.org/concepts/mode/
        mode:       isDevelopment ? 'development' : 'production',
        // https://webpack.js.org/configuration/entry-context/#entry
        entry: {
            main:   compact([
                (isDevelopment ? path.join(home, 'node_modules/webpack-hot-middleware/client.js') : null),
                path.join(home, 'client/index.tsx'),
            ]),
        },
        // https://webpack.js.org/configuration/output/
        output: {
            filename:       '[name].js',
            chunkFilename:  '[name].js',
            publicPath:     '/scripts/',
            path:           path.join(home, 'scripts'),
        },
        // https://webpack.js.org/configuration/module/
        module: {
            rules: [
                {
                    test:       /\.tsx?$/,
                    loader:     'awesome-typescript-loader',
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
                                    localIdentName:             isDevelopment ? '[local]__[path][name]' : '[hash:base64]',
                                    localIdentContext:          path.join(home, 'client'),
                                    localIdentHashPrefix:       'technobuddha',
                                    exportLocalsConvention:     'camelCase',
                                    exportOnlyLocals:           false,
                                },
                                //esModule:           true,
                                sourceMap:          true,
                                importLoaders:      1,
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test:       /\.css$/,
                    use: [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules:            false,
                                sourceMap:          true,
                                importLoaders:      1,
                            },
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
            extensions:     [ '.ts', '.tsx', '.js', '.json', '.css', '.pcss' ],
            plugins:        [ new TsConfigPathsPlugin() ],
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
        },
        // https://webpack.js.org/configuration/devtool/
        devtool:        isDevelopment ? 'source-map' : false,
        // https://webpack.js.org/configuration/target/
        target:         'web',
        // https://webpack.js.org/configuration/externals/
        externals:      mapValues(omitBy(externalPackages, v => isNil(v.global)), v => v.global) as Dictionary<string>,
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
            (isDevelopment ? new CMTDWebpackPlugin({ inputDirectoryName: 'client', globPattern: '**/*.pcss', camelCase: true })     : null),
            (isDevelopment ? new webpack.NamedModulesPlugin()                                                                       : null),
            (isDevelopment ? new webpack.HotModuleReplacementPlugin()                                                               : null),
            (isDevelopment ? new BundleAnalyzerPlugin()                                                                             : null),
        ]),
    }
}

const developmentConfig = genClientWebpackConfig(true);
export default developmentConfig;

import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import packageJson from './package.json' with { type: 'json' };

export default function (env, argv) {
    let mode = 'development';

    const plugins = [];

    if (!argv.watch) {
        mode = 'production';

        plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'webpack-report.html',
            openAnalyzer: false
        }));
    }

    return {
        mode,
        devtool: false,
        entry: {
            main: ['./src/scripts/main'],
            lazysizes: ['./src/scripts/lazysizes']
        },
        output: {
            path: path.resolve(`${packageJson.config.output}/`),
            publicPath: '/project/frontend/'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    lazysizes: {
                        test: (mod) => {
                            // Excluding all except lazysizes
                            if (!mod.context.includes('node_modules/lazysizes')) {
                                return false;
                            }

                            return true;
                        },
                        name: 'lazysizes',
                        chunks: 'all',
                        enforce: true
                    },
                    defaultVendors: {
                        test: (mod) => {
                            // Only include all node_modules excluding lazysizes
                            if (!mod.context.includes('node_modules') || mod.context.includes('lazysizes')) {
                                return false;
                            }

                            return true;
                        },
                        name: 'vendor',
                        chunks: 'all',
                        enforce: true
                    }
                }
            },
            runtimeChunk: {
                name: 'runtime'
            },
            minimizer: [
                new TerserPlugin()
            ]
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.(js|mjs)$/,
                    exclude: [
                        /\bcore-js\b/,
                        /\bwebpack\/buildin\b/
                    ],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    resolve: {
                        // https://webpack.js.org/configuration/module/#resolvefullyspecified
                        fullySpecified: false
                    }
                }
            ]
        }
    };
};
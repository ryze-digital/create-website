const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const packageJson = require('./package.json');

module.exports = (env, argv) => {
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
            path: path.resolve(__dirname, `${packageJson.config.output}/`),
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
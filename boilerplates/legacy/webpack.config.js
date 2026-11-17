import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

/**
 * @param {string} env
 * @param {object} argv
 * @returns {object}
 */
export default function (env, argv) {
    let mode = "development";

    const plugins = [];

    if (!argv.watch) {
        mode = "production";

        plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: "webpack-report.html",
                openAnalyzer: false,
            }),
        );
    }

    return {
        mode,
        devtool: false,
        entry: {
            main: ["./src/scripts/main"],
            // feature:lazysizes:start
            lazysizes: ["./src/scripts/lazysizes"],
            // feature:lazysizes:end
        },
        output: {
            path: path.resolve("__OUTPUT_PATH__"),
            publicPath: "/project/frontend/",
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    defaultVendors: {
                        test: (mod) => {
                            // Only include node_modules
                            if (!mod.context.includes("node_modules")) {
                                return false;
                            }

                            // feature:lazysizes:start
                            // Excluding lazysizes, because it has its own entry chunk and must not be moved to vendor
                            if (mod.context.includes("lazysizes")) {
                                return false;
                            }

                            // feature:lazysizes:end
                            return true;
                        },
                        name: "vendor",
                        chunks: "all",
                        enforce: true,
                    },
                },
            },
            runtimeChunk: {
                name: "runtime",
            },
            minimizer: [new TerserPlugin()],
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.(js|mjs)$/,
                    exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/],
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                        },
                    },
                    resolve: {
                        // https://webpack.js.org/configuration/module/#resolvefullyspecified
                        fullySpecified: false,
                    },
                },
            ],
        },
    };
}

const coreJsVersion = require("core-js/package.json").version;

module.exports = function (api) {
    api.cache(true);

    return {
        presets: ["@babel/preset-env"],
        plugins: [
            [
                "babel-plugin-polyfill-corejs3",
                {
                    method: "usage-global",
                    version: coreJsVersion,
                },
            ],
        ],
        sourceType: "unambiguous",
    };
};

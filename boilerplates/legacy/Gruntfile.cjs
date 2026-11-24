module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            cssGhostInspector: {
                expand: true,
                cwd: "__OUTPUT_PATH__/",
                src: ["*.css", "!*.ghost-inspector.css"],
                dest: "__OUTPUT_PATH__/",
                options: {
                    process(content) {
                        content = content.replace(/font-display:optional/g, "font-display:block");
                        content = content.replace(/scroll-behavior:smooth/g, "scroll-behavior:auto");
                        content += "html{scrollbar-gutter:stable}";

                        return content;
                    },
                },
                rename(dest, src) {
                    return dest + src.replace(".css", ".ghost-inspector.css");
                },
            },
        },
        cacheBust: {
            base: {
                options: {
                    length: 8,
                    algorithm: "md5",
                    baseDir: "./__OUTPUT_PATH__/",
                    assets: ["*", "!**/*.*.*", "!manifest.json", "*.ghost-inspector.*"],
                    deleteOriginals: true,
                    jsonOutput: true,
                    jsonOutputFilename: "manifest.json",
                    outputDir: "",
                    clearOutputDir: true,
                },
                src: ["__OUTPUT_PATH__/*.css", "__OUTPUT_PATH__/*.js"],
            },
        },
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-cache-bust");

    grunt.registerTask("pre-production", ["copy", "cacheBust"]);
};

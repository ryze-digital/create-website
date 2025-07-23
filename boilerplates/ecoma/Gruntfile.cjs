const packageJson = require('./package.json');

module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            cssGhostInspector: {
                expand: true,
                cwd: `${packageJson.config.output}/`,
                src: [
                    '*.css',
                    '!*.ghost-inspector.css'
                ],
                dest: `${packageJson.config.output}/`,
                options: {
                    process (content) {
                        content = content.replace(/font-display:optional/g, 'font-display:block');
                        content = content.replace(/scroll-behavior:smooth/g, 'scroll-behavior:auto');

                        return content;
                    }
                },
                rename (dest, src) {
                    return dest + src.replace('.css', '.ghost-inspector.css');
                }
            }
        },
        cacheBust: {
            base: {
                options: {
                    length: 8,
                    algorithm: 'md5',
                    baseDir: `./${packageJson.config.output}/`,
                    assets: ['*', '!**/*.*.*', '!manifest.json', '*.ghost-inspector.*'],
                    deleteOriginals: true,
                    jsonOutput: true,
                    jsonOutputFilename: 'manifest.json',
                    outputDir: '',
                    clearOutputDir: true
                },
                src: [
                    `${packageJson.config.output}/*.css`,
                    `${packageJson.config.output}/*.js`
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-cache-bust');

    grunt.registerTask('pre-production', ['copy', 'cacheBust']);
};

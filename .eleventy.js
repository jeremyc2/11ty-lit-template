const tailwindPlugin = require("tailwind-lit-rollup-plugin/tailwind-plugin.cjs");
const glob = require("glob");
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
    eleventyConfig.on('eleventy.before', async ({ inputDir }) => {
        const componentFiles = glob.sync(`${inputDir}/components/**/*.@(js|ts)`);
        componentFiles.forEach(async (file) => {
            const fileContents = fs.readFileSync(file, {encoding: 'utf-8'});
            const res = tailwindPlugin().transform(fileContents, path.basename(file));
            fs.mkdirSync('dist/components', { recursive: true });
            fs.writeFileSync(`dist/${file.substring(inputDir.length)}`, res);
        });
    });

    return {
        dir: {
            input: 'src',
            includes: '_includes',
            output: 'dist',
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
    };
}
const autoprefixer = require(`autoprefixer`);
const magicImporter = require(`node-sass-magic-importer`);
const postcss = require(`postcss`);
const postcssScssSyntax = require(`postcss-scss`);
const sass = require(`node-sass`);

module.exports = (inputFile, options = { cwd: process.cwd() }) => {
  const css = sass.renderSync({
    file: inputFile,
    importer: magicImporter(options)
  }).css.toString();
  return postcss(autoprefixer).process(css, { syntax: postcssScssSyntax }).css;
};

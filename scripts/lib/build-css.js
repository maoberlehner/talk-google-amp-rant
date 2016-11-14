const autoprefixer = require(`autoprefixer`);
const CleanCss = require(`clean-css`);
const magicImporter = require(`node-sass-magic-importer`);
const postcss = require(`postcss`);
const postcssScssSyntax = require(`postcss-scss`);
const sass = require(`node-sass`);

module.exports = (inputFile, options = { cwd: process.cwd() }) => {
  let css = sass.renderSync({
    file: inputFile,
    importer: magicImporter(options)
  }).css.toString();
  css = postcss(autoprefixer).process(css, { syntax: postcssScssSyntax }).css;

  return new CleanCss().minify(css).styles;
};

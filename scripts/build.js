const fs = require(`fs-extra`);
const Handlebars = require(`handlebars`);
const path = require(`path`);
const rimraf = require(`rimraf`);

const buildCss = require(`./lib/build-css.js`);
const getDirectories = require(`./lib/get-directories.js`);

const cwd = process.cwd();
const distDirectory = `${cwd}/dist`;
const builds = getDirectories(`${cwd}/resources/builds`);

const css = buildCss(`${cwd}/resources/scss/global.scss`);

rimraf.sync(distDirectory);

builds.forEach((build) => {
  const data = {
    css
  };
  // eslint-disable-next-line global-require
  const buildData = require(`${cwd}/resources/builds/${build}/data/index.json`);

  buildData.canonical = `https://${buildData.domain}`;
  Object.assign(data, buildData);

  if (data.cards) {
    data.cards = data.cards.map((productId) => {
      // eslint-disable-next-line global-require
      const productData = require(`${cwd}/resources/data/cards/${productId}.json`);
      const assetDirectory = `${distDirectory}/assets/images`;
      const imagePath = `${assetDirectory}/${path.parse(productData.image).base}`;
      fs.mkdirsSync(assetDirectory);
      fs.copy(`${cwd}/resources/images/${productData.image}`, imagePath, (error) => {
        if (error) throw error;
      });

      return productData;
    });
  }

  const template = fs.readFileSync(`${cwd}/resources/views/layout/default.hbs`, `utf8`);
  const html = Handlebars.compile(template)(data);

  try {
    fs.mkdirsSync(distDirectory);
    fs.writeFileSync(`${distDirectory}/${build}.html`, html);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
});

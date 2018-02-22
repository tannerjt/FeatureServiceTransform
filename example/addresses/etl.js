const fs = require('fs');
const { FeatureServiceTransform } = require('../../src/index.js');
const options = require('./options.js');

var transform = new FeatureServiceTransform(options);

transform.stream()
  .pipe(fs.createWriteStream('./addresses.geojson'))
  .on('finish', () => console.log('Finished Writing Standardized File'));

# FeatureServiceTransform

Perform transformations on incoming streams of data from a feature service.

## Example

Writes output geojson file with two new standard fields `street` and `city`.

```javascript
const fs = require('fs');
const { FeatureServiceTransform } = require('../src/index.js');

const options = {
  url: "http://lcmaps.lanecounty.org/arcgis/rest/services/LaneCountyMaps/AddressParcel/MapServer/0/query",
  transformations: {
    "street": {
      transform: (attributes) => {
        let number = attributes['house_nbr'] || '';
        let direction = attributes['pre_direction_code'] || '';
        let street_name = attributes['street_name'] || '';
        let street_type = attributes['street_type_code'] || '';
        return `${number}${direction} ${street_name} ${street_type}`.trim();
      }
    },
    "city": {
      transform: (attributes) => {
        return `${attributes['city_name'] || ''}`.trim();
      }
    }
  }
};

var transform = new FeatureServiceTransform(options);

transform.stream()
  .pipe(fs.createWriteStream('./data_standardized.geojson'))
  .on('finish', () => console.log('Finished Writing Standardized File'));
```

### todo

+ [ ] write functional tests
+ [ ] add examples
+ [ ] add math functions

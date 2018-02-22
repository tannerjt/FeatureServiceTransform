const options = {
  url: "https://maps.deschutes.org/arcgis/rest/services/OpenData/PlaceFD/MapServer/5/query",
  transformations: {
    "address": {
      transform: (attributes) => {
        let address = attributes['ADDRESS'] || '';
        return `${address}, Oregon`.trim();
      }
    }
  }
};

module.exports = options;

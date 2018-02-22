const options = {
  url: "http://lcmaps.lanecounty.org/arcgis/rest/services/LaneCountyMaps/AddressParcel/MapServer/0/query",
  transformations: {
    "street_name": {
      name: "street",
      transform: (attributes) => {
        let number = attributes['house_nbr'] || '';
        let direction = attributes['pre_direction_code'] || '';
        let street_name = attributes['street_name'] || '';
        let street_type = attributes['street_type_code'] || '';
        return `${number}${direction} ${street_name} ${street_type}`.trim();
      }
    },
    "city_name": {
      name: "city",
      transform: (attributes) => {
        return `${attributes['city_name'] || ''}`.trim();
      }
    }
  }
};

module.exports = options;

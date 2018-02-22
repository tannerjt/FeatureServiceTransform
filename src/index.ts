declare var require: any

const request = require('request');
const JSONStream = require('JSONStream');
const TerraformerArcGIS = require('terraformer-arcgis-parser');
const geojsonStream = require('geojson-stream');
const { Transform } = require('stream');
const es = require('event-stream');

// Need interface for options
interface Options {
  url: string;
  transformations: object;
}

// Need class for transform
export class FeatureServiceTransform {
  private featureStream = JSONStream.parse('features.*', this._convert);
  public url;
  public transformations;
  protected qs = {
    where: "1=1",
    outFields: "*",
    returnGeometry: "true",
    f: "json",
    outSR: 4326
  };

  constructor(options: Options) {
    this.url = options.url;
    this.transformations = options.transformations;
  }

  stream() {
    return request.get({ url: this.url, json: true, qs: this.qs })
      .on('error', err => console.log('Error', err))
      .pipe(this.featureStream)
      .pipe(es.mapSync(data => {
        data.properties = this._transform(data.properties);
        return data;
      }))
      .pipe(geojsonStream.stringify());
  }

  _convert(feature) {
    const gj = {
      type: 'Feature',
      properties: feature.attributes,
      geometry: TerraformerArcGIS.parse(feature.geometry)
    }

    return gj;
  }

  _transform(attributes) {
    let transformed = {};
    const newKey = Object.keys(this.transformations);

    for (var i = 0; i < newKey.length; i++) {
      transformed[newKey[i]] = this.transformations[newKey[i]].transform(attributes);
    }
    return transformed;
  }
}

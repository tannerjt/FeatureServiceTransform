"use strict";
exports.__esModule = true;
var request = require('request');
var JSONStream = require('JSONStream');
var TerraformerArcGIS = require('terraformer-arcgis-parser');
var geojsonStream = require('geojson-stream');
var Transform = require('stream').Transform;
var es = require('event-stream');
// Need class for transform
var FeatureServiceTransform = /** @class */ (function () {
    function FeatureServiceTransform(options) {
        this.featureStream = JSONStream.parse('features.*', this._convert);
        this.qs = {
            where: "1=1",
            outFields: "*",
            returnGeometry: "true",
            f: "json",
            outSR: 4326
        };
        this.url = options.url;
        this.transformations = options.transformations;
    }
    FeatureServiceTransform.prototype.stream = function () {
        var _this = this;
        return request.get({ url: this.url, json: true, qs: this.qs })
            .on('error', function (err) { return console.log('Error', err); })
            .pipe(this.featureStream)
            .pipe(es.mapSync(function (data) {
            data.properties = _this._transform(data.properties);
            return data;
        }))
            .pipe(geojsonStream.stringify());
    };
    FeatureServiceTransform.prototype._convert = function (feature) {
        var gj = {
            type: 'Feature',
            properties: feature.attributes,
            geometry: TerraformerArcGIS.parse(feature.geometry)
        };
        return gj;
    };
    FeatureServiceTransform.prototype._transform = function (attributes) {
        var transformed = {};
        var newKey = Object.keys(this.transformations);
        for (var i = 0; i < newKey.length; i++) {
            transformed[newKey[i]] = this.transformations[newKey[i]].transform(attributes);
        }
        return transformed;
    };
    return FeatureServiceTransform;
}());
exports.FeatureServiceTransform = FeatureServiceTransform;

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
        var originalKeys = Object.keys(attributes);
        var desiredKeys = Object.keys(this.transformations);
        for (var i = 0; i < desiredKeys.length; i++) {
            if (originalKeys.indexOf(desiredKeys[i]) !== -1) {
                transformed[this.transformations[desiredKeys[i]]['name']] =
                    this.transformations[desiredKeys[i]].transform(attributes);
            }
        }
        return transformed;
    };
    return FeatureServiceTransform;
}());
exports.FeatureServiceTransform = FeatureServiceTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekMsSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUMvRCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFBLHVDQUFTLENBQXVCO0FBQ3hDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQVFuQywyQkFBMkI7QUFDM0I7SUFZRSxpQ0FBWSxPQUFnQjtRQVhwQixrQkFBYSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUc1RCxPQUFFLEdBQUc7WUFDYixLQUFLLEVBQUUsS0FBSztZQUNaLFNBQVMsRUFBRSxHQUFHO1lBQ2QsY0FBYyxFQUFFLE1BQU07WUFDdEIsQ0FBQyxFQUFFLE1BQU07WUFDVCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUM7UUFHQSxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7UUFDdkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO0lBQ2pELENBQUM7SUFFRCx3Q0FBTSxHQUFOO1FBQUEsaUJBU0M7UUFSQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQzthQUMzRCxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUEsR0FBRyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQXpCLENBQXlCLENBQUM7YUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7YUFDeEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1lBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO2FBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCwwQ0FBUSxHQUFSLFVBQVMsT0FBTztRQUNkLElBQU0sRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFLFNBQVM7WUFDZixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7WUFDOUIsUUFBUSxFQUFFLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1NBQ3BELENBQUE7UUFFRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELDRDQUFVLEdBQVYsVUFBVyxVQUFVO1FBQ25CLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdDLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXRELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0QsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUFuREQsSUFtREM7QUFuRFksMERBQXVCIn0=
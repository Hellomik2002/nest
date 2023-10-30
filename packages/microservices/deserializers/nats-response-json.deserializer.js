"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.NatsResponseJSONDeserializer = void 0;
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var incoming_response_deserializer_1 = require("./incoming-response.deserializer");
var nats_request_json_deserializer_1 = require("./nats-request-json.deserializer");
var natsPackage = {};
/**
 * @publicApi
 */
var NatsResponseJSONDeserializer = /** @class */ (function (_super) {
    __extends(NatsResponseJSONDeserializer, _super);
    function NatsResponseJSONDeserializer() {
        var _this = _super.call(this) || this;
        natsPackage = (0, load_package_util_1.loadPackage)('nats', nats_request_json_deserializer_1.NatsRequestJSONDeserializer.name, function () {
            return require('nats');
        });
        _this.jsonCodec = natsPackage.JSONCodec();
        return _this;
    }
    NatsResponseJSONDeserializer.prototype.deserialize = function (value, options) {
        var decodedRequest = this.jsonCodec.decode(value);
        return _super.prototype.deserialize.call(this, decodedRequest, options);
    };
    return NatsResponseJSONDeserializer;
}(incoming_response_deserializer_1.IncomingResponseDeserializer));
exports.NatsResponseJSONDeserializer = NatsResponseJSONDeserializer;

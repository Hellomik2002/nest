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
exports.KafkaRequestDeserializer = void 0;
var incoming_request_deserializer_1 = require("./incoming-request.deserializer");
/**
 * @publicApi
 */
var KafkaRequestDeserializer = /** @class */ (function (_super) {
    __extends(KafkaRequestDeserializer, _super);
    function KafkaRequestDeserializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KafkaRequestDeserializer.prototype.mapToSchema = function (data, options) {
        var _a;
        if (!options) {
            return {
                pattern: undefined,
                data: undefined
            };
        }
        return {
            pattern: options.channel,
            data: (_a = data === null || data === void 0 ? void 0 : data.value) !== null && _a !== void 0 ? _a : data
        };
    };
    return KafkaRequestDeserializer;
}(incoming_request_deserializer_1.IncomingRequestDeserializer));
exports.KafkaRequestDeserializer = KafkaRequestDeserializer;

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.KafkaParser = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var KafkaParser = /** @class */ (function () {
    function KafkaParser(config) {
        this.keepBinary = (config && config.keepBinary) || false;
    }
    KafkaParser.prototype.parse = function (data) {
        var _this = this;
        // Clone object to as modifying the original one would break KafkaJS retries
        var result = __assign(__assign({}, data), { headers: __assign({}, data.headers) });
        if (!this.keepBinary) {
            result.value = this.decode(data.value);
        }
        if (!(0, shared_utils_1.isNil)(data.key)) {
            result.key = this.decode(data.key);
        }
        if (!(0, shared_utils_1.isNil)(data.headers)) {
            var decodeHeaderByKey = function (key) {
                result.headers[key] = _this.decode(data.headers[key]);
            };
            Object.keys(data.headers).forEach(decodeHeaderByKey);
        }
        else {
            result.headers = {};
        }
        return result;
    };
    KafkaParser.prototype.decode = function (value) {
        if ((0, shared_utils_1.isNil)(value)) {
            return null;
        }
        // A value with the "leading zero byte" indicates the schema payload.
        // The "content" is possibly binary and should not be touched & parsed.
        if (Buffer.isBuffer(value) &&
            value.length > 0 &&
            value.readUInt8(0) === 0) {
            return value;
        }
        var result = value.toString();
        var startChar = result.charAt(0);
        // only try to parse objects and arrays
        if (startChar === '{' || startChar === '[') {
            try {
                result = JSON.parse(value.toString());
            }
            catch (e) { }
        }
        return result;
    };
    return KafkaParser;
}());
exports.KafkaParser = KafkaParser;

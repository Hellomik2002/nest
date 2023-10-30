"use strict";
exports.__esModule = true;
exports.IncomingResponseDeserializer = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
/**
 * @publicApi
 */
var IncomingResponseDeserializer = /** @class */ (function () {
    function IncomingResponseDeserializer() {
    }
    IncomingResponseDeserializer.prototype.deserialize = function (value, options) {
        return this.isExternal(value) ? this.mapToSchema(value) : value;
    };
    IncomingResponseDeserializer.prototype.isExternal = function (value) {
        if (!value) {
            return true;
        }
        if (!(0, shared_utils_1.isUndefined)(value.err) ||
            !(0, shared_utils_1.isUndefined)(value.response) ||
            !(0, shared_utils_1.isUndefined)(value.isDisposed)) {
            return false;
        }
        return true;
    };
    IncomingResponseDeserializer.prototype.mapToSchema = function (value) {
        return {
            id: value && value.id,
            response: value,
            isDisposed: true
        };
    };
    return IncomingResponseDeserializer;
}());
exports.IncomingResponseDeserializer = IncomingResponseDeserializer;

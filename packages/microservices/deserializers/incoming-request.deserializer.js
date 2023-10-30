"use strict";
exports.__esModule = true;
exports.IncomingRequestDeserializer = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
/**
 * @publicApi
 */
var IncomingRequestDeserializer = /** @class */ (function () {
    function IncomingRequestDeserializer() {
    }
    IncomingRequestDeserializer.prototype.deserialize = function (value, options) {
        return this.isExternal(value) ? this.mapToSchema(value, options) : value;
    };
    IncomingRequestDeserializer.prototype.isExternal = function (value) {
        if (!value) {
            return true;
        }
        if (!(0, shared_utils_1.isUndefined)(value.pattern) ||
            !(0, shared_utils_1.isUndefined)(value.data)) {
            return false;
        }
        return true;
    };
    IncomingRequestDeserializer.prototype.mapToSchema = function (value, options) {
        if (!options) {
            return {
                pattern: undefined,
                data: undefined
            };
        }
        return {
            pattern: options.channel,
            data: value
        };
    };
    return IncomingRequestDeserializer;
}());
exports.IncomingRequestDeserializer = IncomingRequestDeserializer;

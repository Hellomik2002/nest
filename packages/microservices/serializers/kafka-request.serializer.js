"use strict";
exports.__esModule = true;
exports.KafkaRequestSerializer = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
/**
 * @publicApi
 */
var KafkaRequestSerializer = /** @class */ (function () {
    function KafkaRequestSerializer() {
    }
    KafkaRequestSerializer.prototype.serialize = function (value) {
        var isNotKafkaMessage = (0, shared_utils_1.isNil)(value) ||
            !(0, shared_utils_1.isObject)(value) ||
            (!('key' in value) && !('value' in value));
        if (isNotKafkaMessage) {
            value = { value: value };
        }
        value.value = this.encode(value.value);
        if (!(0, shared_utils_1.isNil)(value.key)) {
            value.key = this.encode(value.key);
        }
        if ((0, shared_utils_1.isNil)(value.headers)) {
            value.headers = {};
        }
        return value;
    };
    KafkaRequestSerializer.prototype.encode = function (value) {
        var isObjectOrArray = !(0, shared_utils_1.isNil)(value) && !(0, shared_utils_1.isString)(value) && !Buffer.isBuffer(value);
        if (isObjectOrArray) {
            return (0, shared_utils_1.isPlainObject)(value) || Array.isArray(value)
                ? JSON.stringify(value)
                : value.toString();
        }
        else if ((0, shared_utils_1.isUndefined)(value)) {
            return null;
        }
        return value;
    };
    return KafkaRequestSerializer;
}());
exports.KafkaRequestSerializer = KafkaRequestSerializer;

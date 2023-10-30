"use strict";
exports.__esModule = true;
exports.KafkaResponseDeserializer = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var kafka_headers_enum_1 = require("../enums/kafka-headers.enum");
/**
 * @publicApi
 */
var KafkaResponseDeserializer = /** @class */ (function () {
    function KafkaResponseDeserializer() {
    }
    KafkaResponseDeserializer.prototype.deserialize = function (message, options) {
        var id = message.headers[kafka_headers_enum_1.KafkaHeaders.CORRELATION_ID].toString();
        if (!(0, shared_utils_1.isUndefined)(message.headers[kafka_headers_enum_1.KafkaHeaders.NEST_ERR])) {
            return {
                id: id,
                err: message.headers[kafka_headers_enum_1.KafkaHeaders.NEST_ERR],
                isDisposed: true
            };
        }
        if (!(0, shared_utils_1.isUndefined)(message.headers[kafka_headers_enum_1.KafkaHeaders.NEST_IS_DISPOSED])) {
            return {
                id: id,
                response: message.value,
                isDisposed: true
            };
        }
        return {
            id: id,
            response: message.value,
            isDisposed: false
        };
    };
    return KafkaResponseDeserializer;
}());
exports.KafkaResponseDeserializer = KafkaResponseDeserializer;

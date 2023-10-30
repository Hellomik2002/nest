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
exports.MqttRecordSerializer = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var record_builders_1 = require("../record-builders");
var MqttRecordSerializer = /** @class */ (function () {
    function MqttRecordSerializer() {
    }
    MqttRecordSerializer.prototype.serialize = function (packet) {
        if ((packet === null || packet === void 0 ? void 0 : packet.data) &&
            (0, shared_utils_1.isObject)(packet.data) &&
            packet.data instanceof record_builders_1.MqttRecord) {
            var record = packet.data;
            return __assign(__assign({}, packet), { data: record.data, options: record.options });
        }
        return packet;
    };
    return MqttRecordSerializer;
}());
exports.MqttRecordSerializer = MqttRecordSerializer;

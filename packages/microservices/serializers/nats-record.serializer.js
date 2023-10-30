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
exports.NatsRecordSerializer = void 0;
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var record_builders_1 = require("../record-builders");
var natsPackage = {};
var NatsRecordSerializer = /** @class */ (function () {
    function NatsRecordSerializer() {
        natsPackage = (0, load_package_util_1.loadPackage)('nats', NatsRecordSerializer.name, function () {
            return require('nats');
        });
        this.jsonCodec = natsPackage.JSONCodec();
    }
    NatsRecordSerializer.prototype.serialize = function (packet) {
        var natsMessage = (packet === null || packet === void 0 ? void 0 : packet.data) && (0, shared_utils_1.isObject)(packet.data) && packet.data instanceof record_builders_1.NatsRecord
            ? packet.data
            : new record_builders_1.NatsRecordBuilder(packet === null || packet === void 0 ? void 0 : packet.data).build();
        return {
            data: this.jsonCodec.encode(__assign(__assign({}, packet), { data: natsMessage.data })),
            headers: natsMessage.headers
        };
    };
    return NatsRecordSerializer;
}());
exports.NatsRecordSerializer = NatsRecordSerializer;

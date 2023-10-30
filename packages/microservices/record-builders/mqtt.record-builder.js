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
exports.MqttRecordBuilder = exports.MqttRecord = void 0;
var MqttRecord = /** @class */ (function () {
    function MqttRecord(data, options) {
        this.data = data;
        this.options = options;
    }
    return MqttRecord;
}());
exports.MqttRecord = MqttRecord;
var MqttRecordBuilder = /** @class */ (function () {
    function MqttRecordBuilder(data) {
        this.data = data;
    }
    MqttRecordBuilder.prototype.setData = function (data) {
        this.data = data;
        return this;
    };
    MqttRecordBuilder.prototype.setQoS = function (qos) {
        this.options = __assign(__assign({}, this.options), { qos: qos });
        return this;
    };
    MqttRecordBuilder.prototype.setRetain = function (retain) {
        this.options = __assign(__assign({}, this.options), { retain: retain });
        return this;
    };
    MqttRecordBuilder.prototype.setDup = function (dup) {
        this.options = __assign(__assign({}, this.options), { dup: dup });
        return this;
    };
    MqttRecordBuilder.prototype.setProperties = function (properties) {
        this.options = __assign(__assign({}, this.options), { properties: properties });
        return this;
    };
    MqttRecordBuilder.prototype.build = function () {
        return new MqttRecord(this.data, this.options);
    };
    return MqttRecordBuilder;
}());
exports.MqttRecordBuilder = MqttRecordBuilder;

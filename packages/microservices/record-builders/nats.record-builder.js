"use strict";
exports.__esModule = true;
exports.NatsRecordBuilder = exports.NatsRecord = void 0;
var NatsRecord = /** @class */ (function () {
    function NatsRecord(data, headers) {
        this.data = data;
        this.headers = headers;
    }
    return NatsRecord;
}());
exports.NatsRecord = NatsRecord;
var NatsRecordBuilder = /** @class */ (function () {
    function NatsRecordBuilder(data) {
        this.data = data;
    }
    NatsRecordBuilder.prototype.setHeaders = function (headers) {
        this.headers = headers;
        return this;
    };
    NatsRecordBuilder.prototype.setData = function (data) {
        this.data = data;
        return this;
    };
    NatsRecordBuilder.prototype.build = function () {
        return new NatsRecord(this.data, this.headers);
    };
    return NatsRecordBuilder;
}());
exports.NatsRecordBuilder = NatsRecordBuilder;

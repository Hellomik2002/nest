"use strict";
exports.__esModule = true;
exports.RmqRecordBuilder = exports.RmqRecord = void 0;
var RmqRecord = /** @class */ (function () {
    function RmqRecord(data, options) {
        this.data = data;
        this.options = options;
    }
    return RmqRecord;
}());
exports.RmqRecord = RmqRecord;
var RmqRecordBuilder = /** @class */ (function () {
    function RmqRecordBuilder(data) {
        this.data = data;
    }
    RmqRecordBuilder.prototype.setOptions = function (options) {
        this.options = options;
        return this;
    };
    RmqRecordBuilder.prototype.setData = function (data) {
        this.data = data;
        return this;
    };
    RmqRecordBuilder.prototype.build = function () {
        return new RmqRecord(this.data, this.options);
    };
    return RmqRecordBuilder;
}());
exports.RmqRecordBuilder = RmqRecordBuilder;

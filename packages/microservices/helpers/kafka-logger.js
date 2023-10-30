"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.KafkaLogger = void 0;
var kafka_interface_1 = require("../external/kafka.interface");
var KafkaLogger = function (logger) {
    return function (_a) {
        var namespace = _a.namespace, level = _a.level, label = _a.label, log = _a.log;
        var loggerMethod;
        switch (level) {
            case kafka_interface_1.logLevel.ERROR:
            case kafka_interface_1.logLevel.NOTHING:
                loggerMethod = 'error';
                break;
            case kafka_interface_1.logLevel.WARN:
                loggerMethod = 'warn';
                break;
            case kafka_interface_1.logLevel.INFO:
                loggerMethod = 'log';
                break;
            case kafka_interface_1.logLevel.DEBUG:
            default:
                loggerMethod = 'debug';
                break;
        }
        var message = log.message, others = __rest(log, ["message"]);
        if (logger[loggerMethod]) {
            logger[loggerMethod]("".concat(label, " [").concat(namespace, "] ").concat(message, " ").concat(JSON.stringify(others)));
        }
    };
};
exports.KafkaLogger = KafkaLogger;

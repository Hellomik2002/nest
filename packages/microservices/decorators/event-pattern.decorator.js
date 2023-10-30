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
exports.EventPattern = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("../constants");
var pattern_handler_enum_1 = require("../enums/pattern-handler.enum");
/**
 * Subscribes to incoming events which fulfils chosen pattern.
 *
 * @publicApi
 */
var EventPattern = function (metadata, transportOrExtras, maybeExtras) {
    var transport;
    var extras;
    if (((0, shared_utils_1.isNumber)(transportOrExtras) || (0, shared_utils_1.isSymbol)(transportOrExtras)) &&
        (0, shared_utils_1.isNil)(maybeExtras)) {
        transport = transportOrExtras;
    }
    else if ((0, shared_utils_1.isObject)(transportOrExtras) && (0, shared_utils_1.isNil)(maybeExtras)) {
        extras = transportOrExtras;
    }
    else {
        transport = transportOrExtras;
        extras = maybeExtras;
    }
    return function (target, key, descriptor) {
        Reflect.defineMetadata(constants_1.PATTERN_METADATA, [].concat(metadata), descriptor.value);
        Reflect.defineMetadata(constants_1.PATTERN_HANDLER_METADATA, pattern_handler_enum_1.PatternHandler.EVENT, descriptor.value);
        Reflect.defineMetadata(constants_1.TRANSPORT_METADATA, transport, descriptor.value);
        Reflect.defineMetadata(constants_1.PATTERN_EXTRAS_METADATA, __assign(__assign({}, Reflect.getMetadata(constants_1.PATTERN_EXTRAS_METADATA, descriptor.value)), extras), descriptor.value);
        return descriptor;
    };
};
exports.EventPattern = EventPattern;

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
exports.createGrpcMethodMetadata = exports.GrpcStreamCall = exports.GrpcStreamMethod = exports.GrpcMethod = exports.MessagePattern = exports.GrpcMethodStreamingType = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
/* eslint-disable @typescript-eslint/no-use-before-define */
var constants_1 = require("../constants");
var pattern_handler_enum_1 = require("../enums/pattern-handler.enum");
var enums_1 = require("../enums");
var GrpcMethodStreamingType;
(function (GrpcMethodStreamingType) {
    GrpcMethodStreamingType["NO_STREAMING"] = "no_stream";
    GrpcMethodStreamingType["RX_STREAMING"] = "rx_stream";
    GrpcMethodStreamingType["PT_STREAMING"] = "pt_stream";
})(GrpcMethodStreamingType = exports.GrpcMethodStreamingType || (exports.GrpcMethodStreamingType = {}));
/**
 * Subscribes to incoming messages which fulfils chosen pattern.
 *
 * @publicApi
 */
var MessagePattern = function (metadata, transportOrExtras, maybeExtras) {
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
        Reflect.defineMetadata(constants_1.PATTERN_HANDLER_METADATA, pattern_handler_enum_1.PatternHandler.MESSAGE, descriptor.value);
        Reflect.defineMetadata(constants_1.TRANSPORT_METADATA, transport, descriptor.value);
        Reflect.defineMetadata(constants_1.PATTERN_EXTRAS_METADATA, __assign(__assign({}, Reflect.getMetadata(constants_1.PATTERN_EXTRAS_METADATA, descriptor.value)), extras), descriptor.value);
        return descriptor;
    };
};
exports.MessagePattern = MessagePattern;
function GrpcMethod(service, method) {
    return function (target, key, descriptor) {
        var metadata = createGrpcMethodMetadata(target, key, service, method);
        return (0, exports.MessagePattern)(metadata, enums_1.Transport.GRPC)(target, key, descriptor);
    };
}
exports.GrpcMethod = GrpcMethod;
function GrpcStreamMethod(service, method) {
    return function (target, key, descriptor) {
        var metadata = createGrpcMethodMetadata(target, key, service, method, GrpcMethodStreamingType.RX_STREAMING);
        return (0, exports.MessagePattern)(metadata, enums_1.Transport.GRPC)(target, key, descriptor);
    };
}
exports.GrpcStreamMethod = GrpcStreamMethod;
function GrpcStreamCall(service, method) {
    return function (target, key, descriptor) {
        var metadata = createGrpcMethodMetadata(target, key, service, method, GrpcMethodStreamingType.PT_STREAMING);
        return (0, exports.MessagePattern)(metadata, enums_1.Transport.GRPC)(target, key, descriptor);
    };
}
exports.GrpcStreamCall = GrpcStreamCall;
function createGrpcMethodMetadata(target, key, service, method, streaming) {
    if (streaming === void 0) { streaming = GrpcMethodStreamingType.NO_STREAMING; }
    var capitalizeFirstLetter = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    if (!service) {
        var name_1 = target.constructor.name;
        return {
            service: name_1,
            rpc: capitalizeFirstLetter(key),
            streaming: streaming
        };
    }
    if (service && !method) {
        return { service: service, rpc: capitalizeFirstLetter(key), streaming: streaming };
    }
    return { service: service, rpc: method, streaming: streaming };
}
exports.createGrpcMethodMetadata = createGrpcMethodMetadata;

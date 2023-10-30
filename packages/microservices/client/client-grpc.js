"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.ClientGrpcProxy = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var rxjs_1 = require("rxjs");
var constants_1 = require("../constants");
var invalid_grpc_package_exception_1 = require("../errors/invalid-grpc-package.exception");
var invalid_grpc_service_exception_1 = require("../errors/invalid-grpc-service.exception");
var invalid_proto_definition_exception_1 = require("../errors/invalid-proto-definition.exception");
var client_proxy_1 = require("./client-proxy");
var constants_2 = require("./constants");
var grpcPackage = {};
var grpcProtoLoaderPackage = {};
/**
 * @publicApi
 */
var ClientGrpcProxy = /** @class */ (function (_super) {
    __extends(ClientGrpcProxy, _super);
    function ClientGrpcProxy(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.logger = new logger_service_1.Logger(client_proxy_1.ClientProxy.name);
        _this.clients = new Map();
        _this.grpcClients = [];
        _this.url = _this.getOptionsProp(options, 'url') || constants_1.GRPC_DEFAULT_URL;
        var protoLoader = _this.getOptionsProp(options, 'protoLoader') || constants_1.GRPC_DEFAULT_PROTO_LOADER;
        grpcPackage = (0, load_package_util_1.loadPackage)('@grpc/grpc-js', ClientGrpcProxy.name, function () {
            return require('@grpc/grpc-js');
        });
        grpcProtoLoaderPackage = (0, load_package_util_1.loadPackage)(protoLoader, ClientGrpcProxy.name, function () {
            return protoLoader === constants_1.GRPC_DEFAULT_PROTO_LOADER
                ? require('@grpc/proto-loader')
                : require(protoLoader);
        });
        _this.grpcClients = _this.createClients();
        return _this;
    }
    ClientGrpcProxy.prototype.getService = function (name) {
        var _this = this;
        var grpcClient = this.createClientByServiceName(name);
        var clientRef = this.getClient(name);
        if (!clientRef) {
            throw new invalid_grpc_service_exception_1.InvalidGrpcServiceException(name);
        }
        var protoMethods = Object.keys(clientRef[name].prototype);
        var grpcService = {};
        protoMethods.forEach(function (m) {
            grpcService[m] = _this.createServiceMethod(grpcClient, m);
        });
        return grpcService;
    };
    ClientGrpcProxy.prototype.getClientByServiceName = function (name) {
        return this.clients.get(name) || this.createClientByServiceName(name);
    };
    ClientGrpcProxy.prototype.createClientByServiceName = function (name) {
        var clientRef = this.getClient(name);
        if (!clientRef) {
            throw new invalid_grpc_service_exception_1.InvalidGrpcServiceException(name);
        }
        var channelOptions = this.options && this.options.channelOptions
            ? this.options.channelOptions
            : {};
        if (this.options && this.options.maxSendMessageLength) {
            channelOptions['grpc.max_send_message_length'] =
                this.options.maxSendMessageLength;
        }
        if (this.options && this.options.maxReceiveMessageLength) {
            channelOptions['grpc.max_receive_message_length'] =
                this.options.maxReceiveMessageLength;
        }
        if (this.options && this.options.maxMetadataSize) {
            channelOptions['grpc.max_metadata_size'] = this.options.maxMetadataSize;
        }
        var keepaliveOptions = this.getKeepaliveOptions();
        var options = __assign(__assign({}, channelOptions), keepaliveOptions);
        var credentials = this.options.credentials || grpcPackage.credentials.createInsecure();
        var grpcClient = new clientRef[name](this.url, credentials, options);
        this.clients.set(name, grpcClient);
        return grpcClient;
    };
    ClientGrpcProxy.prototype.getKeepaliveOptions = function () {
        if (!(0, shared_utils_1.isObject)(this.options.keepalive)) {
            return {};
        }
        var keepaliveKeys = {
            keepaliveTimeMs: 'grpc.keepalive_time_ms',
            keepaliveTimeoutMs: 'grpc.keepalive_timeout_ms',
            keepalivePermitWithoutCalls: 'grpc.keepalive_permit_without_calls',
            http2MaxPingsWithoutData: 'grpc.http2.max_pings_without_data',
            http2MinTimeBetweenPingsMs: 'grpc.http2.min_time_between_pings_ms',
            http2MinPingIntervalWithoutDataMs: 'grpc.http2.min_ping_interval_without_data_ms',
            http2MaxPingStrikes: 'grpc.http2.max_ping_strikes'
        };
        var keepaliveOptions = {};
        for (var _i = 0, _a = Object.entries(this.options.keepalive); _i < _a.length; _i++) {
            var _b = _a[_i], optionKey = _b[0], optionValue = _b[1];
            var key = keepaliveKeys[optionKey];
            if (key === undefined) {
                continue;
            }
            keepaliveOptions[key] = optionValue;
        }
        return keepaliveOptions;
    };
    ClientGrpcProxy.prototype.createServiceMethod = function (client, methodName) {
        return client[methodName].responseStream
            ? this.createStreamServiceMethod(client, methodName)
            : this.createUnaryServiceMethod(client, methodName);
    };
    ClientGrpcProxy.prototype.createStreamServiceMethod = function (client, methodName) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var isRequestStream = client[methodName].requestStream;
            var stream = new rxjs_1.Observable(function (observer) {
                var isClientCanceled = false;
                var upstreamSubscription;
                var upstreamSubjectOrData = args[0];
                var maybeMetadata = args[1];
                var isUpstreamSubject = upstreamSubjectOrData && (0, shared_utils_1.isFunction)(upstreamSubjectOrData.subscribe);
                var call = isRequestStream && isUpstreamSubject
                    ? client[methodName](maybeMetadata)
                    : client[methodName].apply(client, args);
                if (isRequestStream && isUpstreamSubject) {
                    upstreamSubscription = upstreamSubjectOrData.subscribe(function (val) { return call.write(val); }, function (err) { return call.emit('error', err); }, function () { return call.end(); });
                }
                call.on('data', function (data) { return observer.next(data); });
                call.on('error', function (error) {
                    if (error.details === constants_2.GRPC_CANCELLED) {
                        call.destroy();
                        if (isClientCanceled) {
                            return;
                        }
                    }
                    observer.error(_this.serializeError(error));
                });
                call.on('end', function () {
                    if (upstreamSubscription) {
                        upstreamSubscription.unsubscribe();
                        upstreamSubscription = null;
                    }
                    call.removeAllListeners();
                    observer.complete();
                });
                return function () {
                    if (upstreamSubscription) {
                        upstreamSubscription.unsubscribe();
                        upstreamSubscription = null;
                    }
                    if (call.finished) {
                        return undefined;
                    }
                    isClientCanceled = true;
                    call.cancel();
                };
            });
            return stream;
        };
    };
    ClientGrpcProxy.prototype.createUnaryServiceMethod = function (client, methodName) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var isRequestStream = client[methodName].requestStream;
            var upstreamSubjectOrData = args[0];
            var isUpstreamSubject = upstreamSubjectOrData && (0, shared_utils_1.isFunction)(upstreamSubjectOrData.subscribe);
            if (isRequestStream && isUpstreamSubject) {
                return new rxjs_1.Observable(function (observer) {
                    var isClientCanceled = false;
                    var callArgs = [
                        function (error, data) {
                            if (error) {
                                if (error.details === constants_2.GRPC_CANCELLED || error.code === 1) {
                                    call.destroy();
                                    if (isClientCanceled) {
                                        return;
                                    }
                                }
                                return observer.error(_this.serializeError(error));
                            }
                            observer.next(data);
                            observer.complete();
                        },
                    ];
                    var maybeMetadata = args[1];
                    if (maybeMetadata) {
                        callArgs.unshift(maybeMetadata);
                    }
                    var call = client[methodName].apply(client, callArgs);
                    var upstreamSubscription = upstreamSubjectOrData.subscribe(function (val) { return call.write(val); }, function (err) { return call.emit('error', err); }, function () { return call.end(); });
                    return function () {
                        upstreamSubscription.unsubscribe();
                        if (!call.finished) {
                            isClientCanceled = true;
                            call.cancel();
                        }
                    };
                });
            }
            return new rxjs_1.Observable(function (observer) {
                var call = client[methodName].apply(client, __spreadArray(__spreadArray([], args, false), [function (error, data) {
                        if (error) {
                            return observer.error(_this.serializeError(error));
                        }
                        observer.next(data);
                        observer.complete();
                    }], false));
                return function () {
                    if (!call.finished) {
                        call.cancel();
                    }
                };
            });
        };
    };
    ClientGrpcProxy.prototype.createClients = function () {
        var grpcContext = this.loadProto();
        var packageOption = this.getOptionsProp(this.options, 'package');
        var grpcPackages = [];
        var packageNames = Array.isArray(packageOption)
            ? packageOption
            : [packageOption];
        for (var _i = 0, packageNames_1 = packageNames; _i < packageNames_1.length; _i++) {
            var packageName = packageNames_1[_i];
            var grpcPkg = this.lookupPackage(grpcContext, packageName);
            if (!grpcPkg) {
                var invalidPackageError = new invalid_grpc_package_exception_1.InvalidGrpcPackageException(packageName);
                this.logger.error(invalidPackageError.message, invalidPackageError.stack);
                throw invalidPackageError;
            }
            grpcPackages.push(grpcPkg);
        }
        return grpcPackages;
    };
    ClientGrpcProxy.prototype.loadProto = function () {
        try {
            var file = this.getOptionsProp(this.options, 'protoPath');
            var loader = this.getOptionsProp(this.options, 'loader');
            var packageDefinition = this.getOptionsProp(this.options, 'packageDefinition') ||
                grpcProtoLoaderPackage.loadSync(file, loader);
            var packageObject = grpcPackage.loadPackageDefinition(packageDefinition);
            return packageObject;
        }
        catch (err) {
            var invalidProtoError = new invalid_proto_definition_exception_1.InvalidProtoDefinitionException(err.path);
            var message = err && err.message ? err.message : invalidProtoError.message;
            this.logger.error(message, invalidProtoError.stack);
            throw invalidProtoError;
        }
    };
    ClientGrpcProxy.prototype.lookupPackage = function (root, packageName) {
        /** Reference: https://github.com/kondi/rxjs-grpc */
        var pkg = root;
        if (packageName) {
            for (var _i = 0, _a = packageName.split('.'); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                pkg = pkg[name_1];
            }
        }
        return pkg;
    };
    ClientGrpcProxy.prototype.close = function () {
        this.grpcClients
            .filter(function (client) { return client && (0, shared_utils_1.isFunction)(client.close); })
            .forEach(function (client) { return client.close(); });
        this.grpcClients = [];
    };
    ClientGrpcProxy.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('The "connect()" method is not supported in gRPC mode.');
            });
        });
    };
    ClientGrpcProxy.prototype.send = function (pattern, data) {
        throw new Error('Method is not supported in gRPC mode. Use ClientGrpc instead (learn more in the documentation).');
    };
    ClientGrpcProxy.prototype.getClient = function (name) {
        return this.grpcClients.find(function (client) { return client.hasOwnProperty(name); });
    };
    ClientGrpcProxy.prototype.publish = function (packet, callback) {
        throw new Error('Method is not supported in gRPC mode. Use ClientGrpc instead (learn more in the documentation).');
    };
    ClientGrpcProxy.prototype.dispatchEvent = function (packet) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method is not supported in gRPC mode. Use ClientGrpc instead (learn more in the documentation).');
            });
        });
    };
    return ClientGrpcProxy;
}(client_proxy_1.ClientProxy));
exports.ClientGrpcProxy = ClientGrpcProxy;

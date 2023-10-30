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
exports.__esModule = true;
exports.ServerGrpc = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var constants_1 = require("../constants");
var decorators_1 = require("../decorators");
var enums_1 = require("../enums");
var invalid_grpc_package_exception_1 = require("../errors/invalid-grpc-package.exception");
var invalid_proto_definition_exception_1 = require("../errors/invalid-proto-definition.exception");
var server_1 = require("./server");
var grpcPackage = {};
var grpcProtoLoaderPackage = {};
var ServerGrpc = /** @class */ (function (_super) {
    __extends(ServerGrpc, _super);
    function ServerGrpc(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.transportId = enums_1.Transport.GRPC;
        _this.url = _this.getOptionsProp(options, 'url') || constants_1.GRPC_DEFAULT_URL;
        var protoLoader = _this.getOptionsProp(options, 'protoLoader') || constants_1.GRPC_DEFAULT_PROTO_LOADER;
        grpcPackage = _this.loadPackage('@grpc/grpc-js', ServerGrpc.name, function () {
            return require('@grpc/grpc-js');
        });
        grpcProtoLoaderPackage = _this.loadPackage(protoLoader, ServerGrpc.name, function () {
            return protoLoader === constants_1.GRPC_DEFAULT_PROTO_LOADER
                ? require('@grpc/proto-loader')
                : require(protoLoader);
        });
        return _this;
    }
    ServerGrpc.prototype.listen = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.createClient()];
                    case 1:
                        _a.grpcClient = _b.sent();
                        return [4 /*yield*/, this.start(callback)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        callback(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ServerGrpc.prototype.start = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bindEvents()];
                    case 1:
                        _a.sent();
                        this.grpcClient.start();
                        callback();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerGrpc.prototype.bindEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var grpcContext, packageOption, packageNames, _i, packageNames_1, packageName, grpcPkg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        grpcContext = this.loadProto();
                        packageOption = this.getOptionsProp(this.options, 'package');
                        packageNames = Array.isArray(packageOption)
                            ? packageOption
                            : [packageOption];
                        _i = 0, packageNames_1 = packageNames;
                        _a.label = 1;
                    case 1:
                        if (!(_i < packageNames_1.length)) return [3 /*break*/, 4];
                        packageName = packageNames_1[_i];
                        grpcPkg = this.lookupPackage(grpcContext, packageName);
                        return [4 /*yield*/, this.createServices(grpcPkg, packageName)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Will return all of the services along with their fully namespaced
     * names as an array of objects.
     * This method initiates recursive scan of grpcPkg object
     */
    ServerGrpc.prototype.getServiceNames = function (grpcPkg) {
        // Define accumulator to collect all of the services available to load
        var services = [];
        // Initiate recursive services collector starting with empty name
        this.collectDeepServices('', grpcPkg, services);
        return services;
    };
    /**
     * Will create service mapping from gRPC generated Object to handlers
     * defined with @GrpcMethod or @GrpcStreamMethod annotations
     *
     * @param grpcService
     * @param name
     */
    ServerGrpc.prototype.createService = function (grpcService, name) {
        return __awaiter(this, void 0, void 0, function () {
            var service, _a, _b, _c, _i, methodName, pattern, methodHandler, streamingType, methodFunction, methodReqStreaming, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        service = {};
                        _a = grpcService.prototype;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        methodName = _c;
                        pattern = '';
                        methodHandler = null;
                        streamingType = decorators_1.GrpcMethodStreamingType.NO_STREAMING;
                        methodFunction = grpcService.prototype[methodName];
                        methodReqStreaming = methodFunction.requestStream;
                        if (!(0, shared_utils_1.isUndefined)(methodReqStreaming) && methodReqStreaming) {
                            // Try first pattern to be presented, RX streaming pattern would be
                            // a preferable pattern to select among a few defined
                            pattern = this.createPattern(name, methodName, decorators_1.GrpcMethodStreamingType.RX_STREAMING);
                            methodHandler = this.messageHandlers.get(pattern);
                            streamingType = decorators_1.GrpcMethodStreamingType.RX_STREAMING;
                            // If first pattern didn't match to any of handlers then try
                            // pass-through handler to be presented
                            if (!methodHandler) {
                                pattern = this.createPattern(name, methodName, decorators_1.GrpcMethodStreamingType.PT_STREAMING);
                                methodHandler = this.messageHandlers.get(pattern);
                                streamingType = decorators_1.GrpcMethodStreamingType.PT_STREAMING;
                            }
                        }
                        else {
                            pattern = this.createPattern(name, methodName, decorators_1.GrpcMethodStreamingType.NO_STREAMING);
                            // Select handler if any presented for No-Streaming pattern
                            methodHandler = this.messageHandlers.get(pattern);
                            streamingType = decorators_1.GrpcMethodStreamingType.NO_STREAMING;
                        }
                        if (!methodHandler) {
                            return [3 /*break*/, 3];
                        }
                        _d = service;
                        _e = methodName;
                        return [4 /*yield*/, this.createServiceMethod(methodHandler, grpcService.prototype[methodName], streamingType)];
                    case 2:
                        _d[_e] = _f.sent();
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, service];
                }
            });
        });
    };
    /**
     * Will create a string of a JSON serialized format
     *
     * @param service name of the service which should be a match to gRPC service definition name
     * @param methodName name of the method which is coming after rpc keyword
     * @param streaming GrpcMethodStreamingType parameter which should correspond to
     * stream keyword in gRPC service request part
     */
    ServerGrpc.prototype.createPattern = function (service, methodName, streaming) {
        return JSON.stringify({
            service: service,
            rpc: methodName,
            streaming: streaming
        });
    };
    /**
     * Will return async function which will handle gRPC call
     * with Rx streams or as a direct call passthrough
     *
     * @param methodHandler
     * @param protoNativeHandler
     */
    ServerGrpc.prototype.createServiceMethod = function (methodHandler, protoNativeHandler, streamType) {
        // If proto handler has request stream as "true" then we expect it to have
        // streaming from the side of requester
        if (protoNativeHandler.requestStream) {
            // If any handlers were defined with GrpcStreamMethod annotation use RX
            if (streamType === decorators_1.GrpcMethodStreamingType.RX_STREAMING) {
                return this.createRequestStreamMethod(methodHandler, protoNativeHandler.responseStream);
            }
            // If any handlers were defined with GrpcStreamCall annotation
            else if (streamType === decorators_1.GrpcMethodStreamingType.PT_STREAMING) {
                return this.createStreamCallMethod(methodHandler, protoNativeHandler.responseStream);
            }
        }
        return protoNativeHandler.responseStream
            ? this.createStreamServiceMethod(methodHandler)
            : this.createUnaryServiceMethod(methodHandler);
    };
    ServerGrpc.prototype.createUnaryServiceMethod = function (methodHandler) {
        var _this = this;
        return function (call, callback) { return __awaiter(_this, void 0, void 0, function () {
            var handler, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        handler = methodHandler(call.request, call.metadata, call);
                        _a = this.transformToObservable;
                        return [4 /*yield*/, handler];
                    case 1:
                        _a.apply(this, [_b.sent()]).subscribe({
                            next: function (data) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = callback;
                                        _b = [null];
                                        return [4 /*yield*/, data];
                                    case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                                }
                            }); }); },
                            error: function (err) { return callback(err); }
                        });
                        return [2 /*return*/];
                }
            });
        }); };
    };
    ServerGrpc.prototype.createStreamServiceMethod = function (methodHandler) {
        var _this = this;
        return function (call, callback) { return __awaiter(_this, void 0, void 0, function () {
            var handler, result$, _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        handler = methodHandler(call.request, call.metadata, call);
                        _a = this.transformToObservable;
                        return [4 /*yield*/, handler];
                    case 1:
                        result$ = _a.apply(this, [_b.sent()]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.writeObservableToGrpc(result$, call)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _b.sent();
                        call.emit('error', err_2);
                        return [2 /*return*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
    };
    /**
     * Writes an observable to a GRPC call.
     *
     * This function will ensure that backpressure is managed while writing values
     * that come from an observable to a GRPC call.
     *
     * @param source The observable we want to write out to the GRPC call.
     * @param call The GRPC call we want to write to.
     * @returns A promise that resolves when we're done writing to the call.
     */
    ServerGrpc.prototype.writeObservableToGrpc = function (source, call) {
        return new Promise(function (resolve, reject) {
            // This buffer is used to house values that arrive
            // while the call is in the process of writing and draining.
            var buffer = [];
            var isComplete = false;
            var clearToWrite = true;
            var cleanups = [];
            var cleanup = function () {
                for (var _i = 0, cleanups_1 = cleanups; _i < cleanups_1.length; _i++) {
                    var cleanup_1 = cleanups_1[_i];
                    cleanup_1();
                }
            };
            var write = function (value) {
                // If the stream `write` returns `false`, we have
                // to wait for a drain event before writing again.
                // This is done to handle backpressure.
                clearToWrite = call.write(value);
            };
            var done = function () {
                call.end();
                resolve();
                cleanup();
            };
            // Handling backpressure by waiting for drain event
            var drainHandler = function () {
                if (!clearToWrite) {
                    clearToWrite = true;
                    if (buffer.length > 0) {
                        // Write any queued values we have in our buffer.
                        write(buffer.shift());
                    }
                    else if (isComplete) {
                        // Otherwise, if we're complete, end the call.
                        done();
                    }
                }
            };
            call.on('drain', drainHandler);
            cleanups.push(function () {
                call.off('drain', drainHandler);
            });
            var subscription = new rxjs_1.Subscription();
            // Make sure that a cancel event unsubscribes from
            // the source observable.
            var cancelHandler = function () {
                subscription.unsubscribe();
                done();
            };
            call.on(constants_1.CANCEL_EVENT, cancelHandler);
            cleanups.push(function () {
                call.off(constants_1.CANCEL_EVENT, cancelHandler);
            });
            subscription.add(source.subscribe({
                next: function (value) {
                    if (clearToWrite) {
                        // If we're not currently writing, then
                        // we can write the value immediately.
                        write(value);
                    }
                    else {
                        // If a value arrives while we're writing
                        // then we queue it up to be processed FIFO.
                        buffer.push(value);
                    }
                },
                error: function (err) {
                    call.emit('error', err);
                    reject(err);
                    cleanup();
                },
                complete: function () {
                    isComplete = true;
                    if (buffer.length === 0) {
                        done();
                    }
                }
            }));
        });
    };
    ServerGrpc.prototype.createRequestStreamMethod = function (methodHandler, isResponseStream) {
        var _this = this;
        return function (call, callback) { return __awaiter(_this, void 0, void 0, function () {
            var req, handler, res, _a, err_3, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = new rxjs_1.Subject();
                        call.on('data', function (m) { return req.next(m); });
                        call.on('error', function (e) {
                            // Check if error means that stream ended on other end
                            var isCancelledError = String(e).toLowerCase().indexOf('cancelled');
                            if (isCancelledError) {
                                call.end();
                                return;
                            }
                            // If another error then just pass it along
                            req.error(e);
                        });
                        call.on('end', function () { return req.complete(); });
                        handler = methodHandler(req.asObservable(), call.metadata, call);
                        _a = this.transformToObservable;
                        return [4 /*yield*/, handler];
                    case 1:
                        res = _a.apply(this, [_b.sent()]);
                        if (!isResponseStream) return [3 /*break*/, 6];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.writeObservableToGrpc(res, call)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _b.sent();
                        call.emit('error', err_3);
                        return [2 /*return*/];
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(res.pipe((0, operators_1.takeUntil)((0, rxjs_1.fromEvent)(call, constants_1.CANCEL_EVENT)), (0, operators_1.catchError)(function (err) {
                            callback(err, null);
                            return rxjs_1.EMPTY;
                        }), (0, rxjs_1.defaultIfEmpty)(undefined)))];
                    case 7:
                        response = _b.sent();
                        if (!(0, shared_utils_1.isUndefined)(response)) {
                            callback(null, response);
                        }
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
    };
    ServerGrpc.prototype.createStreamCallMethod = function (methodHandler, isResponseStream) {
        var _this = this;
        return function (call, callback) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (isResponseStream) {
                    methodHandler(call);
                }
                else {
                    methodHandler(call, callback);
                }
                return [2 /*return*/];
            });
        }); };
    };
    ServerGrpc.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var graceful;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.grpcClient) return [3 /*break*/, 3];
                        graceful = this.getOptionsProp(this.options, 'gracefulShutdown');
                        if (!graceful) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.grpcClient.tryShutdown(function (error) {
                                    if (error)
                                        reject(error);
                                    else
                                        resolve();
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.grpcClient.forceShutdown();
                        _a.label = 3;
                    case 3:
                        this.grpcClient = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerGrpc.prototype.deserialize = function (obj) {
        try {
            return JSON.parse(obj);
        }
        catch (e) {
            return obj;
        }
    };
    ServerGrpc.prototype.addHandler = function (pattern, callback, isEventHandler) {
        if (isEventHandler === void 0) { isEventHandler = false; }
        var route = (0, shared_utils_1.isString)(pattern) ? pattern : JSON.stringify(pattern);
        callback.isEventHandler = isEventHandler;
        this.messageHandlers.set(route, callback);
    };
    ServerGrpc.prototype.createClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var channelOptions, server, credentials;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        channelOptions = this.options && this.options.channelOptions
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
                        server = new grpcPackage.Server(channelOptions);
                        credentials = this.getOptionsProp(this.options, 'credentials');
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                server.bindAsync(_this.url, credentials || grpcPackage.ServerCredentials.createInsecure(), function (error, port) {
                                    return error ? reject(error) : resolve(port);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, server];
                }
            });
        });
    };
    ServerGrpc.prototype.lookupPackage = function (root, packageName) {
        /** Reference: https://github.com/kondi/rxjs-grpc */
        var pkg = root;
        for (var _i = 0, _a = packageName.split(/\./); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            pkg = pkg[name_1];
        }
        return pkg;
    };
    ServerGrpc.prototype.loadProto = function () {
        try {
            var file = this.getOptionsProp(this.options, 'protoPath');
            var loader = this.getOptionsProp(this.options, 'loader');
            var packageDefinition = grpcProtoLoaderPackage.loadSync(file, loader);
            var packageObject = grpcPackage.loadPackageDefinition(packageDefinition);
            return packageObject;
        }
        catch (err) {
            var invalidProtoError = new invalid_proto_definition_exception_1.InvalidProtoDefinitionException(err.path);
            var message = err && err.message ? err.message : invalidProtoError.message;
            this.logger.error(message, invalidProtoError.stack);
            throw err;
        }
    };
    /**
     * Recursively fetch all of the service methods available on loaded
     * protobuf descriptor object, and collect those as an objects with
     * dot-syntax full-path names.
     *
     * Example:
     *  for proto package Bundle.FirstService with service Events { rpc...
     *  will be resolved to object of (while loaded for Bundle package):
     *    {
     *      name: "FirstService.Events",
     *      service: {Object}
     *    }
     */
    ServerGrpc.prototype.collectDeepServices = function (name, grpcDefinition, accumulator) {
        if (!(0, shared_utils_1.isObject)(grpcDefinition)) {
            return;
        }
        var keysToTraverse = Object.keys(grpcDefinition);
        // Traverse definitions or namespace extensions
        for (var _i = 0, keysToTraverse_1 = keysToTraverse; _i < keysToTraverse_1.length; _i++) {
            var key = keysToTraverse_1[_i];
            var nameExtended = this.parseDeepServiceName(name, key);
            var deepDefinition = grpcDefinition[key];
            var isServiceDefined = deepDefinition && !(0, shared_utils_1.isUndefined)(deepDefinition.service);
            var isServiceBoolean = isServiceDefined
                ? deepDefinition.service !== false
                : false;
            if (isServiceDefined && isServiceBoolean) {
                accumulator.push({
                    name: nameExtended,
                    service: deepDefinition
                });
            }
            // Continue recursion until objects end or service definition found
            else {
                this.collectDeepServices(nameExtended, deepDefinition, accumulator);
            }
        }
    };
    ServerGrpc.prototype.parseDeepServiceName = function (name, key) {
        // If depth is zero then just return key
        if (name.length === 0) {
            return key;
        }
        // Otherwise add next through dot syntax
        return name + '.' + key;
    };
    ServerGrpc.prototype.createServices = function (grpcPkg, packageName) {
        return __awaiter(this, void 0, void 0, function () {
            var invalidPackageError, _i, _a, definition, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!grpcPkg) {
                            invalidPackageError = new invalid_grpc_package_exception_1.InvalidGrpcPackageException(packageName);
                            this.logger.error(invalidPackageError.message, invalidPackageError.stack);
                            throw invalidPackageError;
                        }
                        _i = 0, _a = this.getServiceNames(grpcPkg);
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        definition = _a[_i];
                        _c = (_b = this.grpcClient).addService;
                        _d = [
                            // First parameter requires exact service definition from proto
                            definition.service.service];
                        // Here full proto definition required along with namespaced pattern name
                        return [4 /*yield*/, this.createService(definition.service, definition.name)];
                    case 2:
                        _c.apply(_b, _d.concat([
                            // Here full proto definition required along with namespaced pattern name
                            _e.sent()]));
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ServerGrpc;
}(server_1.Server));
exports.ServerGrpc = ServerGrpc;

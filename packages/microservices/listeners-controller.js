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
exports.ListenersController = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var context_id_factory_1 = require("@nestjs/core/helpers/context-id-factory");
var execution_context_host_1 = require("@nestjs/core/helpers/execution-context-host");
var constants_1 = require("@nestjs/core/injector/constants");
var metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
var request_constants_1 = require("@nestjs/core/router/request/request-constants");
var rxjs_1 = require("rxjs");
var request_context_host_1 = require("./context/request-context-host");
var rpc_metadata_constants_1 = require("./context/rpc-metadata-constants");
var enums_1 = require("./enums");
var listener_metadata_explorer_1 = require("./listener-metadata-explorer");
var server_1 = require("./server");
var ListenersController = /** @class */ (function () {
    function ListenersController(clientsContainer, contextCreator, container, injector, clientFactory, exceptionFiltersContext, graphInspector) {
        this.clientsContainer = clientsContainer;
        this.contextCreator = contextCreator;
        this.container = container;
        this.injector = injector;
        this.clientFactory = clientFactory;
        this.exceptionFiltersContext = exceptionFiltersContext;
        this.graphInspector = graphInspector;
        this.metadataExplorer = new listener_metadata_explorer_1.ListenerMetadataExplorer(new metadata_scanner_1.MetadataScanner());
        this.exceptionFiltersCache = new WeakMap();
    }
    ListenersController.prototype.registerPatternHandlers = function (instanceWrapper, server, moduleKey) {
        var _this = this;
        var instance = instanceWrapper.instance;
        var isStatic = instanceWrapper.isDependencyTreeStatic();
        var patternHandlers = this.metadataExplorer.explore(instance);
        var moduleRef = this.container.getModuleByKey(moduleKey);
        var defaultCallMetadata = server instanceof server_1.ServerGrpc
            ? rpc_metadata_constants_1.DEFAULT_GRPC_CALLBACK_METADATA
            : rpc_metadata_constants_1.DEFAULT_CALLBACK_METADATA;
        patternHandlers
            .filter(function (_a) {
            var transport = _a.transport;
            return (0, shared_utils_1.isUndefined)(transport) ||
                (0, shared_utils_1.isUndefined)(server.transportId) ||
                transport === server.transportId;
        })
            .reduce(function (acc, handler) {
            handler.patterns.forEach(function (pattern) {
                return acc.push(__assign(__assign({}, handler), { patterns: [pattern] }));
            });
            return acc;
        }, [])
            .forEach(function (definition) {
            var pattern = definition.patterns[0], targetCallback = definition.targetCallback, methodKey = definition.methodKey, extras = definition.extras, isEventHandler = definition.isEventHandler;
            _this.insertEntrypointDefinition(instanceWrapper, definition, server.transportId);
            if (isStatic) {
                var proxy_1 = _this.contextCreator.create(instance, targetCallback, moduleKey, methodKey, constants_1.STATIC_CONTEXT, undefined, defaultCallMetadata);
                if (isEventHandler) {
                    var eventHandler_1 = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return __awaiter(_this, void 0, void 0, function () {
                            var originalArgs, dataOrContextHost, returnValue;
                            return __generator(this, function (_a) {
                                originalArgs = args;
                                dataOrContextHost = originalArgs[0];
                                if (dataOrContextHost instanceof request_context_host_1.RequestContextHost) {
                                    args = args.slice(1, args.length);
                                }
                                returnValue = proxy_1.apply(void 0, args);
                                return [2 /*return*/, this.forkJoinHandlersIfAttached(returnValue, originalArgs, eventHandler_1)];
                            });
                        });
                    };
                    return server.addHandler(pattern, eventHandler_1, isEventHandler, extras);
                }
                else {
                    return server.addHandler(pattern, proxy_1, isEventHandler, extras);
                }
            }
            var asyncHandler = _this.createRequestScopedHandler(instanceWrapper, pattern, moduleRef, moduleKey, methodKey, defaultCallMetadata, isEventHandler);
            server.addHandler(pattern, asyncHandler, isEventHandler, extras);
        });
    };
    ListenersController.prototype.insertEntrypointDefinition = function (instanceWrapper, definition, transportId) {
        var _a;
        this.graphInspector.insertEntrypointDefinition({
            type: 'microservice',
            methodName: definition.methodKey,
            className: (_a = instanceWrapper.metatype) === null || _a === void 0 ? void 0 : _a.name,
            classNodeId: instanceWrapper.id,
            metadata: {
                key: definition.patterns.toString(),
                transportId: typeof transportId === 'number'
                    ? enums_1.Transport[transportId]
                    : transportId,
                patterns: definition.patterns,
                isEventHandler: definition.isEventHandler,
                extras: definition.extras
            }
        }, instanceWrapper.id);
    };
    ListenersController.prototype.forkJoinHandlersIfAttached = function (currentReturnValue, originalArgs, handlerRef) {
        if (handlerRef.next) {
            var returnedValueWrapper = handlerRef.next.apply(handlerRef, originalArgs);
            return (0, rxjs_1.forkJoin)({
                current: this.transformToObservable(currentReturnValue),
                next: this.transformToObservable(returnedValueWrapper)
            });
        }
        return currentReturnValue;
    };
    ListenersController.prototype.assignClientsToProperties = function (instance) {
        for (var _i = 0, _a = this.metadataExplorer.scanForClientHooks(instance); _i < _a.length; _i++) {
            var _b = _a[_i], property = _b.property, metadata = _b.metadata;
            var client = this.clientFactory.create(metadata);
            this.clientsContainer.addClient(client);
            this.assignClientToInstance(instance, property, client);
        }
    };
    ListenersController.prototype.assignClientToInstance = function (instance, property, client) {
        Reflect.set(instance, property, client);
    };
    ListenersController.prototype.createRequestScopedHandler = function (wrapper, pattern, moduleRef, moduleKey, methodKey, defaultCallMetadata, isEventHandler) {
        var _this = this;
        if (defaultCallMetadata === void 0) { defaultCallMetadata = rpc_metadata_constants_1.DEFAULT_CALLBACK_METADATA; }
        if (isEventHandler === void 0) { isEventHandler = false; }
        var collection = moduleRef.controllers;
        var instance = wrapper.instance;
        var isTreeDurable = wrapper.isDependencyTreeDurable();
        var requestScopedHandler = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var contextId, dataOrContextHost, data, reqCtx, request, contextInstance, proxy, returnValue, err_1, exceptionFilter, host;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            contextId = void 0;
                            dataOrContextHost = args[0];
                            if (dataOrContextHost instanceof request_context_host_1.RequestContextHost) {
                                contextId = this.getContextId(dataOrContextHost, isTreeDurable);
                                args.shift();
                            }
                            else {
                                data = args[0], reqCtx = args[1];
                                request = request_context_host_1.RequestContextHost.create(pattern, data, reqCtx);
                                contextId = this.getContextId(request, isTreeDurable);
                                dataOrContextHost = request;
                            }
                            return [4 /*yield*/, this.injector.loadPerContext(instance, moduleRef, collection, contextId)];
                        case 1:
                            contextInstance = _a.sent();
                            proxy = this.contextCreator.create(contextInstance, contextInstance[methodKey], moduleKey, methodKey, contextId, wrapper.id, defaultCallMetadata);
                            returnValue = proxy.apply(void 0, args);
                            if (isEventHandler) {
                                return [2 /*return*/, this.forkJoinHandlersIfAttached(returnValue, __spreadArray([dataOrContextHost], args, true), requestScopedHandler)];
                            }
                            return [2 /*return*/, returnValue];
                        case 2:
                            err_1 = _a.sent();
                            exceptionFilter = this.exceptionFiltersCache.get(instance[methodKey]);
                            if (!exceptionFilter) {
                                exceptionFilter = this.exceptionFiltersContext.create(instance, instance[methodKey], moduleKey);
                                this.exceptionFiltersCache.set(instance[methodKey], exceptionFilter);
                            }
                            host = new execution_context_host_1.ExecutionContextHost(args);
                            host.setType('rpc');
                            return [2 /*return*/, exceptionFilter.handle(err_1, host)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return requestScopedHandler;
    };
    ListenersController.prototype.getContextId = function (request, isTreeDurable) {
        var contextId = context_id_factory_1.ContextIdFactory.getByRequest(request);
        if (!request[request_constants_1.REQUEST_CONTEXT_ID]) {
            Object.defineProperty(request, request_constants_1.REQUEST_CONTEXT_ID, {
                value: contextId,
                enumerable: false,
                writable: false,
                configurable: false
            });
            var requestProviderValue = isTreeDurable ? contextId.payload : request;
            this.container.registerRequestProvider(requestProviderValue, contextId);
        }
        return contextId;
    };
    ListenersController.prototype.transformToObservable = function (resultOrDeferred) {
        if (resultOrDeferred instanceof Promise) {
            return (0, rxjs_1.from)(resultOrDeferred).pipe((0, rxjs_1.mergeMap)(function (val) { return ((0, rxjs_1.isObservable)(val) ? val : (0, rxjs_1.of)(val)); }));
        }
        if ((0, rxjs_1.isObservable)(resultOrDeferred)) {
            return resultOrDeferred;
        }
        return (0, rxjs_1.of)(resultOrDeferred);
    };
    return ListenersController;
}());
exports.ListenersController = ListenersController;

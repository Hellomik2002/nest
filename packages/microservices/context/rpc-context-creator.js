"use strict";
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
exports.RpcContextCreator = void 0;
var constants_1 = require("@nestjs/common/constants");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_2 = require("@nestjs/core/guards/constants");
var context_utils_1 = require("@nestjs/core/helpers/context-utils");
var handler_metadata_storage_1 = require("@nestjs/core/helpers/handler-metadata-storage");
var constants_3 = require("@nestjs/core/injector/constants");
var constants_4 = require("../constants");
var exceptions_1 = require("../exceptions");
var rpc_params_factory_1 = require("../factories/rpc-params-factory");
var rpc_metadata_constants_1 = require("./rpc-metadata-constants");
var RpcContextCreator = /** @class */ (function () {
    function RpcContextCreator(rpcProxy, exceptionFiltersContext, pipesContextCreator, pipesConsumer, guardsContextCreator, guardsConsumer, interceptorsContextCreator, interceptorsConsumer) {
        this.rpcProxy = rpcProxy;
        this.exceptionFiltersContext = exceptionFiltersContext;
        this.pipesContextCreator = pipesContextCreator;
        this.pipesConsumer = pipesConsumer;
        this.guardsContextCreator = guardsContextCreator;
        this.guardsConsumer = guardsConsumer;
        this.interceptorsContextCreator = interceptorsContextCreator;
        this.interceptorsConsumer = interceptorsConsumer;
        this.contextUtils = new context_utils_1.ContextUtils();
        this.rpcParamsFactory = new rpc_params_factory_1.RpcParamsFactory();
        this.handlerMetadataStorage = new handler_metadata_storage_1.HandlerMetadataStorage();
    }
    RpcContextCreator.prototype.create = function (instance, callback, moduleKey, methodName, contextId, inquirerId, defaultCallMetadata) {
        var _this = this;
        if (contextId === void 0) { contextId = constants_3.STATIC_CONTEXT; }
        if (defaultCallMetadata === void 0) { defaultCallMetadata = rpc_metadata_constants_1.DEFAULT_CALLBACK_METADATA; }
        var contextType = 'rpc';
        var _a = this.getMetadata(instance, methodName, defaultCallMetadata, contextType), argsLength = _a.argsLength, paramtypes = _a.paramtypes, getParamsMetadata = _a.getParamsMetadata;
        var exceptionHandler = this.exceptionFiltersContext.create(instance, callback, moduleKey, contextId, inquirerId);
        var pipes = this.pipesContextCreator.create(instance, callback, moduleKey, contextId, inquirerId);
        var guards = this.guardsContextCreator.create(instance, callback, moduleKey, contextId, inquirerId);
        var interceptors = this.interceptorsContextCreator.create(instance, callback, moduleKey, contextId, inquirerId);
        var paramsMetadata = getParamsMetadata(moduleKey);
        var paramsOptions = paramsMetadata
            ? this.contextUtils.mergeParamsMetatypes(paramsMetadata, paramtypes)
            : [];
        var fnApplyPipes = this.createPipesFn(pipes, paramsOptions);
        var fnCanActivate = this.createGuardsFn(guards, instance, callback, contextType);
        var handler = function (initialArgs, args) { return function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fnApplyPipes) return [3 /*break*/, 2];
                        return [4 /*yield*/, fnApplyPipes.apply(void 0, __spreadArray([initialArgs], args, false))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, callback.apply(instance, initialArgs)];
                    case 2: return [2 /*return*/, callback.apply(instance, args)];
                }
            });
        }); }; };
        return this.rpcProxy.create(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var initialArgs, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            initialArgs = this.contextUtils.createNullArray(argsLength);
                            _a = fnCanActivate;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, fnCanActivate(args)];
                        case 1:
                            _a = (_b.sent());
                            _b.label = 2;
                        case 2:
                            _a;
                            return [2 /*return*/, this.interceptorsConsumer.intercept(interceptors, args, instance, callback, handler(initialArgs, args), contextType)];
                    }
                });
            });
        }, exceptionHandler);
    };
    RpcContextCreator.prototype.reflectCallbackParamtypes = function (instance, callback) {
        return Reflect.getMetadata(constants_1.PARAMTYPES_METADATA, instance, callback.name);
    };
    RpcContextCreator.prototype.createGuardsFn = function (guards, instance, callback, contextType) {
        var _this = this;
        var canActivateFn = function (args) { return __awaiter(_this, void 0, void 0, function () {
            var canActivate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.guardsConsumer.tryActivate(guards, args, instance, callback, contextType)];
                    case 1:
                        canActivate = _a.sent();
                        if (!canActivate) {
                            throw new exceptions_1.RpcException(constants_2.FORBIDDEN_MESSAGE);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        return guards.length ? canActivateFn : null;
    };
    RpcContextCreator.prototype.getMetadata = function (instance, methodName, defaultCallMetadata, contextType) {
        var _this = this;
        var cacheMetadata = this.handlerMetadataStorage.get(instance, methodName);
        if (cacheMetadata) {
            return cacheMetadata;
        }
        var metadata = this.contextUtils.reflectCallbackMetadata(instance, methodName, constants_4.PARAM_ARGS_METADATA) || defaultCallMetadata;
        var keys = Object.keys(metadata);
        var argsLength = this.contextUtils.getArgumentsLength(keys, metadata);
        var paramtypes = this.contextUtils.reflectCallbackParamtypes(instance, methodName);
        var contextFactory = this.contextUtils.getContextFactory(contextType, instance, instance[methodName]);
        var getParamsMetadata = function (moduleKey) {
            return _this.exchangeKeysForValues(keys, metadata, moduleKey, _this.rpcParamsFactory, contextFactory);
        };
        var handlerMetadata = {
            argsLength: argsLength,
            paramtypes: paramtypes,
            getParamsMetadata: getParamsMetadata
        };
        this.handlerMetadataStorage.set(instance, methodName, handlerMetadata);
        return handlerMetadata;
    };
    RpcContextCreator.prototype.exchangeKeysForValues = function (keys, metadata, moduleContext, paramsFactory, contextFactory) {
        var _this = this;
        this.pipesContextCreator.setModuleContext(moduleContext);
        return keys.map(function (key) {
            var _a = metadata[key], index = _a.index, data = _a.data, pipesCollection = _a.pipes;
            var pipes = _this.pipesContextCreator.createConcreteContext(pipesCollection);
            var type = _this.contextUtils.mapParamType(key);
            if (key.includes(constants_1.CUSTOM_ROUTE_ARGS_METADATA)) {
                var factory = metadata[key].factory;
                var customExtractValue = _this.contextUtils.getCustomFactory(factory, data, contextFactory);
                return { index: index, extractValue: customExtractValue, type: type, data: data, pipes: pipes };
            }
            var numericType = Number(type);
            var extractValue = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return paramsFactory.exchangeKeyForValue(numericType, data, args);
            };
            return { index: index, extractValue: extractValue, type: numericType, data: data, pipes: pipes };
        });
    };
    RpcContextCreator.prototype.createPipesFn = function (pipes, paramsOptions) {
        var _this = this;
        var pipesFn = function (args) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var resolveParamValue;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            resolveParamValue = function (param) { return __awaiter(_this, void 0, void 0, function () {
                                var index, extractValue, type, data, metatype, paramPipes, value, _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            index = param.index, extractValue = param.extractValue, type = param.type, data = param.data, metatype = param.metatype, paramPipes = param.pipes;
                                            value = extractValue.apply(void 0, params);
                                            _a = args;
                                            _b = index;
                                            return [4 /*yield*/, this.getParamValue(value, { metatype: metatype, type: type, data: data }, pipes.concat(paramPipes))];
                                        case 1:
                                            _a[_b] = _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, Promise.all(paramsOptions.map(resolveParamValue))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return paramsOptions.length ? pipesFn : null;
    };
    RpcContextCreator.prototype.getParamValue = function (value, _a, pipes) {
        var metatype = _a.metatype, type = _a.type, data = _a.data;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, (0, shared_utils_1.isEmpty)(pipes)
                        ? value
                        : this.pipesConsumer.apply(value, { metatype: metatype, type: type, data: data }, pipes)];
            });
        });
    };
    return RpcContextCreator;
}());
exports.RpcContextCreator = RpcContextCreator;

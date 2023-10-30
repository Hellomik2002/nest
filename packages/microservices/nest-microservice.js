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
exports.__esModule = true;
exports.NestMicroservice = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var constants_1 = require("@nestjs/core/constants");
var optional_require_1 = require("@nestjs/core/helpers/optional-require");
var injector_1 = require("@nestjs/core/injector/injector");
var nest_application_context_1 = require("@nestjs/core/nest-application-context");
var transport_enum_1 = require("./enums/transport.enum");
var microservices_module_1 = require("./microservices-module");
var server_factory_1 = require("./server/server-factory");
var SocketModule = (0, optional_require_1.optionalRequire)('@nestjs/websockets/socket-module', function () { return require('@nestjs/websockets/socket-module'); }).SocketModule;
var NestMicroservice = /** @class */ (function (_super) {
    __extends(NestMicroservice, _super);
    function NestMicroservice(container, config, graphInspector, applicationConfig) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, container, config) || this;
        _this.graphInspector = graphInspector;
        _this.applicationConfig = applicationConfig;
        _this.logger = new logger_service_1.Logger(NestMicroservice.name, {
            timestamp: true
        });
        _this.microservicesModule = new microservices_module_1.MicroservicesModule();
        _this.socketModule = SocketModule ? new SocketModule() : null;
        _this.isTerminated = false;
        _this.isInitHookCalled = false;
        _this.injector = new injector_1.Injector({ preview: config.preview });
        _this.microservicesModule.register(container, _this.graphInspector, _this.applicationConfig, _this.appOptions);
        _this.createServer(config);
        _this.selectContextModule();
        return _this;
    }
    NestMicroservice.prototype.createServer = function (config) {
        try {
            this.microserviceConfig = __assign({ transport: transport_enum_1.Transport.TCP }, config);
            var strategy = config.strategy;
            this.server = strategy
                ? strategy
                : server_factory_1.ServerFactory.create(this.microserviceConfig);
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    };
    NestMicroservice.prototype.registerModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.socketModule &&
                            this.socketModule.register(this.container, this.applicationConfig, this.graphInspector, this.appOptions);
                        if (!this.appOptions.preview) {
                            this.microservicesModule.setupClients(this.container);
                            this.registerListeners();
                        }
                        this.setIsInitialized(true);
                        if (!!this.isInitHookCalled) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.callInitHook()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.callBootstrapHook()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NestMicroservice.prototype.registerListeners = function () {
        this.microservicesModule.setupListeners(this.container, this.server);
    };
    NestMicroservice.prototype.useWebSocketAdapter = function (adapter) {
        this.applicationConfig.setIoAdapter(adapter);
        return this;
    };
    NestMicroservice.prototype.useGlobalFilters = function () {
        var _a;
        var _this = this;
        var filters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filters[_i] = arguments[_i];
        }
        (_a = this.applicationConfig).useGlobalFilters.apply(_a, filters);
        filters.forEach(function (item) {
            return _this.graphInspector.insertOrphanedEnhancer({
                subtype: 'filter',
                ref: item
            });
        });
        return this;
    };
    NestMicroservice.prototype.useGlobalPipes = function () {
        var _a;
        var _this = this;
        var pipes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pipes[_i] = arguments[_i];
        }
        (_a = this.applicationConfig).useGlobalPipes.apply(_a, pipes);
        pipes.forEach(function (item) {
            return _this.graphInspector.insertOrphanedEnhancer({
                subtype: 'pipe',
                ref: item
            });
        });
        return this;
    };
    NestMicroservice.prototype.useGlobalInterceptors = function () {
        var _a;
        var _this = this;
        var interceptors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            interceptors[_i] = arguments[_i];
        }
        (_a = this.applicationConfig).useGlobalInterceptors.apply(_a, interceptors);
        interceptors.forEach(function (item) {
            return _this.graphInspector.insertOrphanedEnhancer({
                subtype: 'interceptor',
                ref: item
            });
        });
        return this;
    };
    NestMicroservice.prototype.useGlobalGuards = function () {
        var _a;
        var _this = this;
        var guards = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            guards[_i] = arguments[_i];
        }
        (_a = this.applicationConfig).useGlobalGuards.apply(_a, guards);
        guards.forEach(function (item) {
            return _this.graphInspector.insertOrphanedEnhancer({
                subtype: 'guard',
                ref: item
            });
        });
        return this;
    };
    NestMicroservice.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isInitialized) {
                            return [2 /*return*/, this];
                        }
                        return [4 /*yield*/, _super.prototype.init.call(this)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.registerModules()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    NestMicroservice.prototype.listen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.assertNotInPreviewMode('listen');
                        _a = !this.isInitialized;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.registerModules()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.server.listen(function (err, info) {
                                    var _a, _b;
                                    if ((_b = (_a = _this.microserviceConfig) === null || _a === void 0 ? void 0 : _a.autoFlushLogs) !== null && _b !== void 0 ? _b : true) {
                                        _this.flushLogs();
                                    }
                                    if (err) {
                                        return reject(err);
                                    }
                                    _this.logger.log(constants_1.MESSAGES.MICROSERVICE_READY);
                                    resolve(info);
                                });
                            })];
                }
            });
        });
    };
    NestMicroservice.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.server.close()];
                    case 1:
                        _a.sent();
                        if (this.isTerminated) {
                            return [2 /*return*/];
                        }
                        this.setIsTerminated(true);
                        return [4 /*yield*/, this.closeApplication()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NestMicroservice.prototype.setIsInitialized = function (isInitialized) {
        this.isInitialized = isInitialized;
    };
    NestMicroservice.prototype.setIsTerminated = function (isTerminated) {
        this.isTerminated = isTerminated;
    };
    NestMicroservice.prototype.setIsInitHookCalled = function (isInitHookCalled) {
        this.isInitHookCalled = isInitHookCalled;
    };
    NestMicroservice.prototype.closeApplication = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.socketModule;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.socketModule.close()];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a;
                        _b = this.microservicesModule;
                        if (!_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.microservicesModule.close()];
                    case 3:
                        _b = (_c.sent());
                        _c.label = 4;
                    case 4:
                        _b;
                        return [4 /*yield*/, _super.prototype.close.call(this)];
                    case 5:
                        _c.sent();
                        this.setIsTerminated(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    NestMicroservice.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.isTerminated) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.server.close()];
                    case 1:
                        _c.sent();
                        _a = this.socketModule;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.socketModule.close()];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        _a;
                        _b = this.microservicesModule;
                        if (!_b) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.microservicesModule.close()];
                    case 4:
                        _b = (_c.sent());
                        _c.label = 5;
                    case 5:
                        _b;
                        return [2 /*return*/];
                }
            });
        });
    };
    return NestMicroservice;
}(nest_application_context_1.NestApplicationContext));
exports.NestMicroservice = NestMicroservice;

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
exports.__esModule = true;
exports.MicroservicesModule = void 0;
var runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
var guards_1 = require("@nestjs/core/guards");
var injector_1 = require("@nestjs/core/injector/injector");
var interceptors_1 = require("@nestjs/core/interceptors");
var pipes_1 = require("@nestjs/core/pipes");
var client_1 = require("./client");
var container_1 = require("./container");
var exception_filters_context_1 = require("./context/exception-filters-context");
var rpc_context_creator_1 = require("./context/rpc-context-creator");
var rpc_proxy_1 = require("./context/rpc-proxy");
var listeners_controller_1 = require("./listeners-controller");
var MicroservicesModule = /** @class */ (function () {
    function MicroservicesModule() {
        this.clientsContainer = new container_1.ClientsContainer();
    }
    MicroservicesModule.prototype.register = function (container, graphInspector, config, options) {
        this.appOptions = options;
        var exceptionFiltersContext = new exception_filters_context_1.ExceptionFiltersContext(container, config);
        var contextCreator = new rpc_context_creator_1.RpcContextCreator(new rpc_proxy_1.RpcProxy(), exceptionFiltersContext, new pipes_1.PipesContextCreator(container, config), new pipes_1.PipesConsumer(), new guards_1.GuardsContextCreator(container, config), new guards_1.GuardsConsumer(), new interceptors_1.InterceptorsContextCreator(container, config), new interceptors_1.InterceptorsConsumer());
        var injector = new injector_1.Injector();
        this.listenersController = new listeners_controller_1.ListenersController(this.clientsContainer, contextCreator, container, injector, client_1.ClientProxyFactory, exceptionFiltersContext, graphInspector);
    };
    MicroservicesModule.prototype.setupListeners = function (container, server) {
        var _this = this;
        if (!this.listenersController) {
            throw new runtime_exception_1.RuntimeException();
        }
        var modules = container.getModules();
        modules.forEach(function (_a, moduleRef) {
            var controllers = _a.controllers;
            return _this.bindListeners(controllers, server, moduleRef);
        });
    };
    MicroservicesModule.prototype.setupClients = function (container) {
        var _this = this;
        var _a;
        if (!this.listenersController) {
            throw new runtime_exception_1.RuntimeException();
        }
        if ((_a = this.appOptions) === null || _a === void 0 ? void 0 : _a.preview) {
            return;
        }
        var modules = container.getModules();
        modules.forEach(function (_a) {
            var controllers = _a.controllers, providers = _a.providers;
            _this.bindClients(controllers);
            _this.bindClients(providers);
        });
    };
    MicroservicesModule.prototype.bindListeners = function (controllers, server, moduleName) {
        var _this = this;
        controllers.forEach(function (wrapper) {
            return _this.listenersController.registerPatternHandlers(wrapper, server, moduleName);
        });
    };
    MicroservicesModule.prototype.bindClients = function (items) {
        var _this = this;
        items.forEach(function (_a) {
            var instance = _a.instance, isNotMetatype = _a.isNotMetatype;
            !isNotMetatype &&
                _this.listenersController.assignClientsToProperties(instance);
        });
    };
    MicroservicesModule.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clients = this.clientsContainer.getAllClients();
                        return [4 /*yield*/, Promise.all(clients.map(function (client) { return client.close(); }))];
                    case 1:
                        _a.sent();
                        this.clientsContainer.clear();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MicroservicesModule;
}());
exports.MicroservicesModule = MicroservicesModule;

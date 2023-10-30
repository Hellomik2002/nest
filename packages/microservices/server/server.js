"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.Server = void 0;
var logger_service_1 = require("@nestjs/common/services/logger.service");
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var constants_1 = require("../constants");
var incoming_request_deserializer_1 = require("../deserializers/incoming-request.deserializer");
var identity_serializer_1 = require("../serializers/identity.serializer");
var utils_1 = require("../utils");
var Server = /** @class */ (function () {
    function Server() {
        this.messageHandlers = new Map();
        this.logger = new logger_service_1.Logger(Server.name);
    }
    Server.prototype.addHandler = function (pattern, callback, isEventHandler, extras) {
        if (isEventHandler === void 0) { isEventHandler = false; }
        if (extras === void 0) { extras = {}; }
        var normalizedPattern = this.normalizePattern(pattern);
        callback.isEventHandler = isEventHandler;
        callback.extras = extras;
        if (this.messageHandlers.has(normalizedPattern) && isEventHandler) {
            var headRef = this.messageHandlers.get(normalizedPattern);
            var getTail_1 = function (handler) {
                return (handler === null || handler === void 0 ? void 0 : handler.next) ? getTail_1(handler.next) : handler;
            };
            var tailRef = getTail_1(headRef);
            tailRef.next = callback;
        }
        else {
            this.messageHandlers.set(normalizedPattern, callback);
        }
    };
    Server.prototype.getHandlers = function () {
        return this.messageHandlers;
    };
    Server.prototype.getHandlerByPattern = function (pattern) {
        var route = this.getRouteFromPattern(pattern);
        return this.messageHandlers.has(route)
            ? this.messageHandlers.get(route)
            : null;
    };
    Server.prototype.send = function (stream$, respond) {
        var _this = this;
        var dataBuffer = null;
        var scheduleOnNextTick = function (data) {
            if (!dataBuffer) {
                dataBuffer = [data];
                process.nextTick(function () { return __awaiter(_this, void 0, void 0, function () {
                    var _i, dataBuffer_1, item;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _i = 0, dataBuffer_1 = dataBuffer;
                                _a.label = 1;
                            case 1:
                                if (!(_i < dataBuffer_1.length)) return [3 /*break*/, 4];
                                item = dataBuffer_1[_i];
                                return [4 /*yield*/, respond(item)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                dataBuffer = null;
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else if (!data.isDisposed) {
                dataBuffer = dataBuffer.concat(data);
            }
            else {
                dataBuffer[dataBuffer.length - 1].isDisposed = data.isDisposed;
            }
        };
        return stream$
            .pipe((0, operators_1.catchError)(function (err) {
            scheduleOnNextTick({ err: err });
            return rxjs_1.EMPTY;
        }), (0, operators_1.finalize)(function () { return scheduleOnNextTick({ isDisposed: true }); }))
            .subscribe(function (response) { return scheduleOnNextTick({ response: response }); });
    };
    Server.prototype.handleEvent = function (pattern, packet, context) {
        return __awaiter(this, void 0, void 0, function () {
            var handler, resultOrStream, connectableSource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = this.getHandlerByPattern(pattern);
                        if (!handler) {
                            return [2 /*return*/, this.logger.error((0, constants_1.NO_EVENT_HANDLER)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), pattern))];
                        }
                        return [4 /*yield*/, handler(packet.data, context)];
                    case 1:
                        resultOrStream = _a.sent();
                        if ((0, rxjs_1.isObservable)(resultOrStream)) {
                            connectableSource = (0, rxjs_1.connectable)(resultOrStream, {
                                connector: function () { return new rxjs_1.Subject(); },
                                resetOnDisconnect: false
                            });
                            connectableSource.connect();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.transformToObservable = function (resultOrDeferred) {
        if (resultOrDeferred instanceof Promise) {
            return (0, rxjs_1.from)(resultOrDeferred).pipe((0, operators_1.mergeMap)(function (val) { return ((0, rxjs_1.isObservable)(val) ? val : (0, rxjs_1.of)(val)); }));
        }
        if ((0, rxjs_1.isObservable)(resultOrDeferred)) {
            return resultOrDeferred;
        }
        return (0, rxjs_1.of)(resultOrDeferred);
    };
    Server.prototype.getOptionsProp = function (obj, prop, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        return obj && prop in obj ? obj[prop] : defaultValue;
    };
    Server.prototype.handleError = function (error) {
        this.logger.error(error);
    };
    Server.prototype.loadPackage = function (name, ctx, loader) {
        return (0, load_package_util_1.loadPackage)(name, ctx, loader);
    };
    Server.prototype.initializeSerializer = function (options) {
        this.serializer =
            (options &&
                options.serializer) ||
                new identity_serializer_1.IdentitySerializer();
    };
    Server.prototype.initializeDeserializer = function (options) {
        this.deserializer =
            (options &&
                options.deserializer) ||
                new incoming_request_deserializer_1.IncomingRequestDeserializer();
    };
    /**
     * Transforms the server Pattern to valid type and returns a route for him.
     *
     * @param  {string} pattern - server pattern
     * @returns string
     */
    Server.prototype.getRouteFromPattern = function (pattern) {
        var validPattern;
        try {
            validPattern = JSON.parse(pattern);
        }
        catch (error) {
            // Uses a fundamental object (`pattern` variable without any conversion)
            validPattern = pattern;
        }
        return this.normalizePattern(validPattern);
    };
    Server.prototype.normalizePattern = function (pattern) {
        return (0, utils_1.transformPatternToRoute)(pattern);
    };
    return Server;
}());
exports.Server = Server;
var templateObject_1;

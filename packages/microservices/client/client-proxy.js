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
exports.ClientProxy = void 0;
var random_string_generator_util_1 = require("@nestjs/common/utils/random-string-generator.util");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var constants_1 = require("../constants");
var incoming_response_deserializer_1 = require("../deserializers/incoming-response.deserializer");
var invalid_message_exception_1 = require("../errors/invalid-message.exception");
var identity_serializer_1 = require("../serializers/identity.serializer");
var utils_1 = require("../utils");
var ClientProxy = /** @class */ (function () {
    function ClientProxy() {
        this.routingMap = new Map();
    }
    ClientProxy.prototype.send = function (pattern, data) {
        var _this = this;
        if ((0, shared_utils_1.isNil)(pattern) || (0, shared_utils_1.isNil)(data)) {
            return (0, rxjs_1.throwError)(function () { return new invalid_message_exception_1.InvalidMessageException(); });
        }
        return (0, rxjs_1.defer)(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.connect()];
        }); }); }).pipe((0, operators_1.mergeMap)(function () {
            return new rxjs_1.Observable(function (observer) {
                var callback = _this.createObserver(observer);
                return _this.publish({ pattern: pattern, data: data }, callback);
            });
        }));
    };
    ClientProxy.prototype.emit = function (pattern, data) {
        var _this = this;
        if ((0, shared_utils_1.isNil)(pattern) || (0, shared_utils_1.isNil)(data)) {
            return (0, rxjs_1.throwError)(function () { return new invalid_message_exception_1.InvalidMessageException(); });
        }
        var source = (0, rxjs_1.defer)(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.connect()];
        }); }); }).pipe((0, operators_1.mergeMap)(function () { return _this.dispatchEvent({ pattern: pattern, data: data }); }));
        var connectableSource = (0, rxjs_1.connectable)(source, {
            connector: function () { return new rxjs_1.Subject(); },
            resetOnDisconnect: false
        });
        connectableSource.connect();
        return connectableSource;
    };
    ClientProxy.prototype.createObserver = function (observer) {
        var _this = this;
        return function (_a) {
            var err = _a.err, response = _a.response, isDisposed = _a.isDisposed;
            if (err) {
                return observer.error(_this.serializeError(err));
            }
            else if (response !== undefined && isDisposed) {
                observer.next(_this.serializeResponse(response));
                return observer.complete();
            }
            else if (isDisposed) {
                return observer.complete();
            }
            observer.next(_this.serializeResponse(response));
        };
    };
    ClientProxy.prototype.serializeError = function (err) {
        return err;
    };
    ClientProxy.prototype.serializeResponse = function (response) {
        return response;
    };
    ClientProxy.prototype.assignPacketId = function (packet) {
        var id = (0, random_string_generator_util_1.randomStringGenerator)();
        return Object.assign(packet, { id: id });
    };
    ClientProxy.prototype.connect$ = function (instance, errorEvent, connectEvent) {
        if (errorEvent === void 0) { errorEvent = constants_1.ERROR_EVENT; }
        if (connectEvent === void 0) { connectEvent = constants_1.CONNECT_EVENT; }
        var error$ = (0, rxjs_1.fromEvent)(instance, errorEvent).pipe((0, operators_1.map)(function (err) {
            throw err;
        }));
        var connect$ = (0, rxjs_1.fromEvent)(instance, connectEvent);
        return (0, rxjs_1.merge)(error$, connect$).pipe((0, operators_1.take)(1));
    };
    ClientProxy.prototype.getOptionsProp = function (obj, prop, defaultValue) {
        if (defaultValue === void 0) { defaultValue = undefined; }
        return obj && prop in obj ? obj[prop] : defaultValue;
    };
    ClientProxy.prototype.normalizePattern = function (pattern) {
        return (0, utils_1.transformPatternToRoute)(pattern);
    };
    ClientProxy.prototype.initializeSerializer = function (options) {
        this.serializer =
            (options &&
                options.serializer) ||
                new identity_serializer_1.IdentitySerializer();
    };
    ClientProxy.prototype.initializeDeserializer = function (options) {
        this.deserializer =
            (options &&
                options.deserializer) ||
                new incoming_response_deserializer_1.IncomingResponseDeserializer();
    };
    return ClientProxy;
}());
exports.ClientProxy = ClientProxy;

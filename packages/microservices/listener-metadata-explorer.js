"use strict";
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
exports.ListenerMetadataExplorer = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("./constants");
var pattern_handler_enum_1 = require("./enums/pattern-handler.enum");
var ListenerMetadataExplorer = /** @class */ (function () {
    function ListenerMetadataExplorer(metadataScanner) {
        this.metadataScanner = metadataScanner;
    }
    ListenerMetadataExplorer.prototype.explore = function (instance) {
        var _this = this;
        var instancePrototype = Object.getPrototypeOf(instance);
        return this.metadataScanner
            .getAllMethodNames(instancePrototype)
            .map(function (method) { return _this.exploreMethodMetadata(instancePrototype, method); })
            .filter(function (metadata) { return metadata; });
    };
    ListenerMetadataExplorer.prototype.exploreMethodMetadata = function (instancePrototype, methodKey) {
        var targetCallback = instancePrototype[methodKey];
        var handlerType = Reflect.getMetadata(constants_1.PATTERN_HANDLER_METADATA, targetCallback);
        if ((0, shared_utils_1.isUndefined)(handlerType)) {
            return;
        }
        var patterns = Reflect.getMetadata(constants_1.PATTERN_METADATA, targetCallback);
        var transport = Reflect.getMetadata(constants_1.TRANSPORT_METADATA, targetCallback);
        var extras = Reflect.getMetadata(constants_1.PATTERN_EXTRAS_METADATA, targetCallback);
        return {
            methodKey: methodKey,
            targetCallback: targetCallback,
            patterns: patterns,
            transport: transport,
            extras: extras,
            isEventHandler: handlerType === pattern_handler_enum_1.PatternHandler.EVENT
        };
    };
    ListenerMetadataExplorer.prototype.scanForClientHooks = function (instance) {
        var _a, _b, _c, _i, propertyKey, property, isClient, metadata;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = instance;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _d.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3 /*break*/, 4];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 3];
                    propertyKey = _c;
                    if ((0, shared_utils_1.isFunction)(propertyKey)) {
                        return [3 /*break*/, 3];
                    }
                    property = String(propertyKey);
                    isClient = Reflect.getMetadata(constants_1.CLIENT_METADATA, instance, property);
                    if ((0, shared_utils_1.isUndefined)(isClient)) {
                        return [3 /*break*/, 3];
                    }
                    metadata = Reflect.getMetadata(constants_1.CLIENT_CONFIGURATION_METADATA, instance, property);
                    return [4 /*yield*/, { property: property, metadata: metadata }];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    return ListenerMetadataExplorer;
}());
exports.ListenerMetadataExplorer = ListenerMetadataExplorer;

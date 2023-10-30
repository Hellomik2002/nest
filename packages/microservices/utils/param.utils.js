"use strict";
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
exports.createPipesRpcParamDecorator = exports.createRpcParamDecorator = void 0;
var route_params_decorator_1 = require("@nestjs/common/decorators/http/route-params.decorator");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
require("reflect-metadata");
var constants_1 = require("../constants");
function createRpcParamDecorator(paramtype) {
    return function () {
        var pipes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pipes[_i] = arguments[_i];
        }
        return function (target, key, index) {
            var args = Reflect.getMetadata(constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
            Reflect.defineMetadata(constants_1.PARAM_ARGS_METADATA, route_params_decorator_1.assignMetadata.apply(void 0, __spreadArray([args, paramtype, index, undefined], pipes, false)), target.constructor, key);
        };
    };
}
exports.createRpcParamDecorator = createRpcParamDecorator;
var createPipesRpcParamDecorator = function (paramtype) {
    return function (data) {
        var pipes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            pipes[_i - 1] = arguments[_i];
        }
        return function (target, key, index) {
            var args = Reflect.getMetadata(constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
            var hasParamData = (0, shared_utils_1.isNil)(data) || (0, shared_utils_1.isString)(data);
            var paramData = hasParamData ? data : undefined;
            var paramPipes = hasParamData ? pipes : __spreadArray([data], pipes, true);
            Reflect.defineMetadata(constants_1.PARAM_ARGS_METADATA, route_params_decorator_1.assignMetadata.apply(void 0, __spreadArray([args, paramtype, index, paramData], paramPipes, false)), target.constructor, key);
        };
    };
};
exports.createPipesRpcParamDecorator = createPipesRpcParamDecorator;

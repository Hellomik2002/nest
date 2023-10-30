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
exports.Payload = void 0;
var rpc_paramtype_enum_1 = require("../enums/rpc-paramtype.enum");
var param_utils_1 = require("../utils/param.utils");
function Payload(propertyOrPipe) {
    var pipes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        pipes[_i - 1] = arguments[_i];
    }
    return (0, param_utils_1.createPipesRpcParamDecorator)(rpc_paramtype_enum_1.RpcParamtype.PAYLOAD).apply(void 0, __spreadArray([propertyOrPipe], pipes, false));
}
exports.Payload = Payload;

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
var _a, _b;
exports.__esModule = true;
exports.DEFAULT_GRPC_CALLBACK_METADATA = exports.DEFAULT_CALLBACK_METADATA = void 0;
var rpc_paramtype_enum_1 = require("../enums/rpc-paramtype.enum");
exports.DEFAULT_CALLBACK_METADATA = (_a = {},
    _a["".concat(rpc_paramtype_enum_1.RpcParamtype.PAYLOAD, ":0")] = { index: 0, data: undefined, pipes: [] },
    _a);
exports.DEFAULT_GRPC_CALLBACK_METADATA = __assign((_b = {}, _b["".concat(rpc_paramtype_enum_1.RpcParamtype.CONTEXT, ":1")] = { index: 1, data: undefined, pipes: [] }, _b["".concat(rpc_paramtype_enum_1.RpcParamtype.GRPC_CALL, ":2")] = { index: 2, data: undefined, pipes: [] }, _b), exports.DEFAULT_CALLBACK_METADATA);

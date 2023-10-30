"use strict";
exports.__esModule = true;
exports.RpcParamsFactory = void 0;
var rpc_paramtype_enum_1 = require("../enums/rpc-paramtype.enum");
var RpcParamsFactory = /** @class */ (function () {
    function RpcParamsFactory() {
    }
    RpcParamsFactory.prototype.exchangeKeyForValue = function (type, data, args) {
        var _a;
        if (!args) {
            return null;
        }
        switch (type) {
            case rpc_paramtype_enum_1.RpcParamtype.PAYLOAD:
                return data ? (_a = args[0]) === null || _a === void 0 ? void 0 : _a[data] : args[0];
            case rpc_paramtype_enum_1.RpcParamtype.CONTEXT:
                return args[1];
            case rpc_paramtype_enum_1.RpcParamtype.GRPC_CALL:
                return args[2];
            default:
                return null;
        }
    };
    return RpcParamsFactory;
}());
exports.RpcParamsFactory = RpcParamsFactory;

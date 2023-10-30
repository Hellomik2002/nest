"use strict";
exports.__esModule = true;
exports.Ctx = void 0;
var rpc_paramtype_enum_1 = require("../enums/rpc-paramtype.enum");
var param_utils_1 = require("../utils/param.utils");
exports.Ctx = (0, param_utils_1.createRpcParamDecorator)(rpc_paramtype_enum_1.RpcParamtype.CONTEXT);

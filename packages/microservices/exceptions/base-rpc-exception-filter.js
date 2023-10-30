"use strict";
exports.__esModule = true;
exports.BaseRpcExceptionFilter = void 0;
/* eslint-disable prefer-spread */
var common_1 = require("@nestjs/common");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var constants_1 = require("@nestjs/core/constants");
var rxjs_1 = require("rxjs");
var rpc_exception_1 = require("./rpc-exception");
/**
 * @publicApi
 */
var BaseRpcExceptionFilter = /** @class */ (function () {
    function BaseRpcExceptionFilter() {
    }
    BaseRpcExceptionFilter.prototype["catch"] = function (exception, host) {
        var status = 'error';
        if (!(exception instanceof rpc_exception_1.RpcException)) {
            return this.handleUnknownError(exception, status);
        }
        var res = exception.getError();
        var message = (0, shared_utils_1.isObject)(res) ? res : { status: status, message: res };
        return (0, rxjs_1.throwError)(function () { return message; });
    };
    BaseRpcExceptionFilter.prototype.handleUnknownError = function (exception, status) {
        var errorMessage = constants_1.MESSAGES.UNKNOWN_EXCEPTION_MESSAGE;
        var loggerArgs = this.isError(exception)
            ? [exception.message, exception.stack]
            : [exception];
        var logger = BaseRpcExceptionFilter.logger;
        logger.error.apply(logger, loggerArgs);
        return (0, rxjs_1.throwError)(function () { return ({ status: status, message: errorMessage }); });
    };
    BaseRpcExceptionFilter.prototype.isError = function (exception) {
        return !!((0, shared_utils_1.isObject)(exception) && exception.message);
    };
    BaseRpcExceptionFilter.logger = new common_1.Logger('RpcExceptionsHandler');
    return BaseRpcExceptionFilter;
}());
exports.BaseRpcExceptionFilter = BaseRpcExceptionFilter;

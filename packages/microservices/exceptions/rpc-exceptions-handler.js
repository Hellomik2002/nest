"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.RpcExceptionsHandler = void 0;
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var select_exception_filter_metadata_util_1 = require("@nestjs/common/utils/select-exception-filter-metadata.util");
var invalid_exception_filter_exception_1 = require("@nestjs/core/errors/exceptions/invalid-exception-filter.exception");
var base_rpc_exception_filter_1 = require("./base-rpc-exception-filter");
/**
 * @publicApi
 */
var RpcExceptionsHandler = /** @class */ (function (_super) {
    __extends(RpcExceptionsHandler, _super);
    function RpcExceptionsHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.filters = [];
        return _this;
    }
    RpcExceptionsHandler.prototype.handle = function (exception, host) {
        var filterResult$ = this.invokeCustomFilters(exception, host);
        if (filterResult$) {
            return filterResult$;
        }
        return _super.prototype["catch"].call(this, exception, host);
    };
    RpcExceptionsHandler.prototype.setCustomFilters = function (filters) {
        if (!Array.isArray(filters)) {
            throw new invalid_exception_filter_exception_1.InvalidExceptionFilterException();
        }
        this.filters = filters;
    };
    RpcExceptionsHandler.prototype.invokeCustomFilters = function (exception, host) {
        if ((0, shared_utils_1.isEmpty)(this.filters)) {
            return null;
        }
        var filter = (0, select_exception_filter_metadata_util_1.selectExceptionFilterMetadata)(this.filters, exception);
        return filter ? filter.func(exception, host) : null;
    };
    return RpcExceptionsHandler;
}(base_rpc_exception_filter_1.BaseRpcExceptionFilter));
exports.RpcExceptionsHandler = RpcExceptionsHandler;

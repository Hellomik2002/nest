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
exports.ExceptionFiltersContext = void 0;
var constants_1 = require("@nestjs/common/constants");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var base_exception_filter_context_1 = require("@nestjs/core/exceptions/base-exception-filter-context");
var constants_2 = require("@nestjs/core/injector/constants");
var iterare_1 = require("iterare");
var rpc_exceptions_handler_1 = require("../exceptions/rpc-exceptions-handler");
/**
 * @publicApi
 */
var ExceptionFiltersContext = /** @class */ (function (_super) {
    __extends(ExceptionFiltersContext, _super);
    function ExceptionFiltersContext(container, config) {
        var _this = _super.call(this, container) || this;
        _this.config = config;
        return _this;
    }
    ExceptionFiltersContext.prototype.create = function (instance, callback, module, contextId, inquirerId) {
        if (contextId === void 0) { contextId = constants_2.STATIC_CONTEXT; }
        this.moduleContext = module;
        var exceptionHandler = new rpc_exceptions_handler_1.RpcExceptionsHandler();
        var filters = this.createContext(instance, callback, constants_1.EXCEPTION_FILTERS_METADATA, contextId, inquirerId);
        if ((0, shared_utils_1.isEmpty)(filters)) {
            return exceptionHandler;
        }
        exceptionHandler.setCustomFilters(filters.reverse());
        return exceptionHandler;
    };
    ExceptionFiltersContext.prototype.getGlobalMetadata = function (contextId, inquirerId) {
        var _this = this;
        if (contextId === void 0) { contextId = constants_2.STATIC_CONTEXT; }
        var globalFilters = this.config.getGlobalFilters();
        if (contextId === constants_2.STATIC_CONTEXT && !inquirerId) {
            return globalFilters;
        }
        var scopedFilterWrappers = this.config.getGlobalRequestFilters();
        var scopedFilters = (0, iterare_1.iterate)(scopedFilterWrappers)
            .map(function (wrapper) {
            return wrapper.getInstanceByContextId(_this.getContextId(contextId, wrapper), inquirerId);
        })
            .filter(function (host) { return !!host; })
            .map(function (host) { return host.instance; })
            .toArray();
        return globalFilters.concat(scopedFilters);
    };
    return ExceptionFiltersContext;
}(base_exception_filter_context_1.BaseExceptionFilterContext));
exports.ExceptionFiltersContext = ExceptionFiltersContext;

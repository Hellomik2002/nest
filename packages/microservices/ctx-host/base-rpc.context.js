"use strict";
exports.__esModule = true;
exports.BaseRpcContext = void 0;
var BaseRpcContext = /** @class */ (function () {
    function BaseRpcContext(args) {
        this.args = args;
    }
    /**
     * Returns the array of arguments being passed to the handler.
     */
    BaseRpcContext.prototype.getArgs = function () {
        return this.args;
    };
    /**
     * Returns a particular argument by index.
     * @param index index of argument to retrieve
     */
    BaseRpcContext.prototype.getArgByIndex = function (index) {
        return this.args[index];
    };
    return BaseRpcContext;
}());
exports.BaseRpcContext = BaseRpcContext;

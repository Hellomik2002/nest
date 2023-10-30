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
exports.RedisContext = void 0;
var base_rpc_context_1 = require("./base-rpc.context");
var RedisContext = /** @class */ (function (_super) {
    __extends(RedisContext, _super);
    function RedisContext(args) {
        return _super.call(this, args) || this;
    }
    /**
     * Returns the name of the channel.
     */
    RedisContext.prototype.getChannel = function () {
        return this.args[0];
    };
    return RedisContext;
}(base_rpc_context_1.BaseRpcContext));
exports.RedisContext = RedisContext;

"use strict";
exports.__esModule = true;
exports.IdentitySerializer = void 0;
var IdentitySerializer = /** @class */ (function () {
    function IdentitySerializer() {
    }
    IdentitySerializer.prototype.serialize = function (value) {
        return value;
    };
    return IdentitySerializer;
}());
exports.IdentitySerializer = IdentitySerializer;

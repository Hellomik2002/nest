"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSocketPortException = void 0;
const runtime_exception_1 = require("@nestjs/core/errors/exceptions/runtime.exception");
class InvalidSocketPortException extends runtime_exception_1.RuntimeException {
    constructor(port, type) {
        super(`Invalid port (${port}) in gateway ${type}`);
    }
}
exports.InvalidSocketPortException = InvalidSocketPortException;

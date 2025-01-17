"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWsExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("@nestjs/core/constants");
const ws_exception_1 = require("../errors/ws-exception");
/**
 * @publicApi
 */
class BaseWsExceptionFilter {
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        this.handleError(client, exception);
    }
    handleError(client, exception) {
        if (!(exception instanceof ws_exception_1.WsException)) {
            return this.handleUnknownError(exception, client);
        }
        const status = 'error';
        const result = exception.getError();
        const message = (0, shared_utils_1.isObject)(result)
            ? result
            : {
                status,
                message: result,
            };
        client.emit('exception', message);
    }
    handleUnknownError(exception, client) {
        const status = 'error';
        client.emit('exception', {
            status,
            message: constants_1.MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
        });
        if (this.isExceptionObject(exception)) {
            return BaseWsExceptionFilter.logger.error(exception.message, exception.stack);
        }
        return BaseWsExceptionFilter.logger.error(exception);
    }
    isExceptionObject(err) {
        return (0, shared_utils_1.isObject)(err) && !!err.message;
    }
}
exports.BaseWsExceptionFilter = BaseWsExceptionFilter;
BaseWsExceptionFilter.logger = new common_1.Logger('WsExceptionsHandler');

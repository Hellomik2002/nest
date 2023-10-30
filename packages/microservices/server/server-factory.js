"use strict";
exports.__esModule = true;
exports.ServerFactory = void 0;
var transport_enum_1 = require("../enums/transport.enum");
var server_grpc_1 = require("./server-grpc");
var server_kafka_1 = require("./server-kafka");
var server_mqtt_1 = require("./server-mqtt");
var server_nats_1 = require("./server-nats");
var server_redis_1 = require("./server-redis");
var server_tcp_1 = require("./server-tcp");
var server_rmq_1 = require("./server-rmq");
var ServerFactory = /** @class */ (function () {
    function ServerFactory() {
    }
    ServerFactory.create = function (microserviceOptions) {
        var _a = microserviceOptions, transport = _a.transport, options = _a.options;
        switch (transport) {
            case transport_enum_1.Transport.REDIS:
                return new server_redis_1.ServerRedis(options);
            case transport_enum_1.Transport.NATS:
                return new server_nats_1.ServerNats(options);
            case transport_enum_1.Transport.MQTT:
                return new server_mqtt_1.ServerMqtt(options);
            case transport_enum_1.Transport.GRPC:
                return new server_grpc_1.ServerGrpc(options);
            case transport_enum_1.Transport.KAFKA:
                return new server_kafka_1.ServerKafka(options);
            case transport_enum_1.Transport.RMQ:
                return new server_rmq_1.ServerRMQ(options);
            default:
                return new server_tcp_1.ServerTCP(options);
        }
    };
    return ServerFactory;
}());
exports.ServerFactory = ServerFactory;

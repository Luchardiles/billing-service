const { Server } = require("@grpc/grpc-js");
const initializeConsumers = require("./rabbitmq/initialize");
const { grpcErrorHandler } = require("./middlewares/grpcErrorHandlerMiddleware");
const loadProto = require("./utils/loadProto");
const billingService = require("./services/billingService");

const server = new Server();
const proto = loadProto("bills");
server.addService(proto.Billing.service, billingService);

// Inicializa manejo global de errores y consumidores de RabbitMQ
grpcErrorHandler(server);
initializeConsumers().then(() => console.log("🐇 Consumers ready"));

module.exports = server;
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 50051,
  serverUrl: process.env.SERVER_URL || "0.0.0.0",
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost",
  userCreatedQueue: process.env.USER_CREATED_QUEUE || "user.created",
  userDeletedQueue: process.env.USER_DELETED_QUEUE || "user.deleted",
  emailUpdatedQueue: process.env.EMAIL_UPDATED_QUEUE || "email.updated",
};
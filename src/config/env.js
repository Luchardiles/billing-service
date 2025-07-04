require("dotenv").config();

module.exports = {
  port: process.env.PORT || 50051,
  serverUrl: process.env.SERVER_URL || "0.0.0.0",
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost",
  userCreatedQueueBilling:
    process.env.USER_CREATED_QUEUE_BILLING || "user.created.billing",
  userDeletedQueueBilling:
    process.env.USER_DELETED_QUEUE_BILLING || "user.deleted.billing",
  emailUpdatedQueue: process.env.EMAIL_UPDATED_QUEUE || "email.updated",
};

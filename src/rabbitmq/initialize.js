const {consumeUserEvents} = require("./consumer");

async function initializeConsumers() {
    try {
        await consumeUserEvents();
        console.log("RabbitMQ consumers initialized successfully.");
    } catch (error) {
        console.error("Error initializing RabbitMQ consumers:", error);
    }
}

module.exports = initializeConsumers;

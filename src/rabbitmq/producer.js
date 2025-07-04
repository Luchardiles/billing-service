const {connectRabbit} = require("./connection");
const {emailUpdatedQueue} = require("../config/env");

async function publishEmailUpdated(emailData) {
    const ch = await connectRabbit();
    await ch.assertQueue(emailUpdatedQueue, { durable: true });
    const payload = JSON.stringify(emailData);
    ch.sendToQueue(emailUpdatedQueue, Buffer.from(payload), { persistent: true });
}

module.exports = {
    publishEmailUpdated
};

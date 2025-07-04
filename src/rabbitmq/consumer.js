const prisma = require ("../database/prisma")
const {connectRabbit} = require("./connection");
const {userCreatedQueueBilling, userDeletedQueueBilling} = require("../config/env");

async function consumeUserEvents() {
    const ch = await connectRabbit();
    await ch.assertQueue(userCreatedQueueBilling, { durable: true });
    await ch.assertQueue(userDeletedQueueBilling, { durable: true });
    ch.consume(userCreatedQueueBilling, async (msg) => {
        try {
            const user = JSON.parse(msg.content.toString());
            await prisma.user.create({ data: user });
            ch.ack(msg);
        } catch (err) {
            console.error("Error processing user created event:", err);
            ch.nack(msg, false, false);
        }
    });
    ch.consume(userDeletedQueueBilling, async (msg) => {
        try {
            const user = JSON.parse(msg.content.toString());
            await prisma.user.delete({ where: { id: user.id } });
            ch.ack(msg);
        } catch (err) {
            console.error("Error processing user deleted event:", err);
            ch.nack(msg, false, false);
        }
    });

}
module.exports = {
    consumeUserEvents
};

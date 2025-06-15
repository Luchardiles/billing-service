const prisma = require ("../database/prisma")
const {connectRabbit} = require("./connection");
const {userCreatedQueue, userDeletedQueue, emailUpdatedQueue} = require("../config/env");

async function consumeUserEvents() {
    const ch = await connectRabbit();
    await ch.assertQueue(userCreatedQueue, { durable: true });
    await ch.assertQueue(userDeletedQueue, { durable: true });
    ch.consume(userCreatedQueue, async (msg) => {
        const user = JSON.parse(msg.content.toString());
        await prisma.user.create({ data: user });
        ch.ack(msg);
    });
    ch.consume(userDeletedQueue, async (msg) => {
        const userId = msg.content.toString();
        await prisma.user.delete({ where: { id: userId } });
        ch.ack(msg);
    });

}
module.exports = {
    consumeUserEvents
};

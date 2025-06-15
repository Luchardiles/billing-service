const {catchGrpc} = require("../utils/catchGrpc");
const AppError = require("../utils/appError");
const prisma = require("../database/prisma");
const {publishEmailUpdatedEvent} = require("../rabbitmq/publisher");

const CreateBill = catchGrpc(async (call, callback) => {
    const { userId, amount, status } = call.request;
    if (!userId || !amount || !status) {
        throw new AppError("Invalid input data", 400);
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const bill = await prisma.bill.create({
        data: {
            status,
            amount,
            userId,
        },
    });
    callback(null, { bill });
});

const GetBill = catchGrpc(async (call, callback) => {
    const { id } = call.request;
    if (!id) {
        throw new AppError("Bill ID is required", 400);
    }
    const bill = await prisma.bill.findUnique({
        where: { id },
    });
    if (!bill || bill.deletedAt) {
        throw new AppError("Bill not found", 404);
    }
    callback(null, { bill });
});

const UpdateBill = catchGrpc(async (call, callback) => {
    const { status } = call.request;
    const { id } = call.request;

    const bill = await prisma.bill.findUnique({
        where: { id },
    });
    if (!bill || bill.deletedAt) {
        throw new AppError("Bill not found", 404);
    }
    let updatedBill;
    if (status == "Pagado") {
        updatedBill = await prisma.bill.update({
            where: { id },
            data: { status, updatedAt: new Date() },
        });
    } else {
        updatedBill = await prisma.bill.update({
            where: { id },
            data: { status, updatedAt: null },
        });
    }
    const userEmail = await prisma.user.findUnique({
        where: { id: updatedBill.userId },
        select: { email: true },
    });
    await publishEmailUpdatedEvent({
        userEmail : userEmail.email,
        bill: { id: updatedBill.id, status: updatedBill.status, amount: updatedBill.amount },
    });
    callback(null, { bill: updatedBill });
});

const DeleteBill = catchGrpc(async (call, callback) => {
    const { id } = call.request;
    if (!id) {
        throw new AppError("Bill ID is required", 400);
    }
    const bill = await prisma.bill.findUnique({
        where: { id },
    });
    if (!bill || bill.deletedAt) {
        throw new AppError("Bill not found", 404);
    }
    await prisma.bill.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
    callback(null, { message: "Bill deleted successfully" });
});

const ListBills = catchGrpc(async (call, callback) => {
    const { userId } = call.request;
    if (!userId) {
        throw new AppError("User ID is required", 400);
    }
    const bills = await prisma.bill.findMany({
        where: { userId, deletedAt: null },
    });
    callback(null, { bills });
});

module.exports = {
    CreateBill,
    GetBill,
    UpdateBill,
    DeleteBill,
    ListBills,
};
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🔄 Starting database seeding...");

    const billsPath = path.resolve(__dirname, "../../mock/bills.json");
    const billsData = JSON.parse(fs.readFileSync(billsPath, "utf-8"));
    const usersPath = path.resolve(__dirname, "../../mock/users.json");
    const usersData = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

    await prisma.bill.deleteMany();
    await prisma.user.deleteMany();

    console.log(`🛠 Seeding ${usersData.length} users...`);
    for (const user of usersData) {
      await prisma.user.create({ data: user });
    }
    
    console.log(`🛠 Seeding ${billsData.length} bills...`);
    for (const bill of billsData) {
      const data = {
        status: bill.status,
        amount: bill.amount,
        createdAt: new Date(bill.createdAt),
        updatedAt: bill.status === "Pagado" ? new Date(bill.createdAt) : null,
        user: { connect: { id: bill.userId } },
      };
      await prisma.bill.create({ data });
    }
    console.log("✅ Database seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("🔌 Prisma Client disconnected");
    process.exit(0);
  });

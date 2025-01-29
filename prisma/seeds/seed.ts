const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminHashedPassword = await bcrypt.hash("securepassword123", 10);
  const userHashedPassword = await bcrypt.hash("userpassword123", 10);

  const admin = await prisma.users.create({
    data: {
      account_name: "Admin Account",
      avatar: null,
      email: "admin@example.com",
      is_account_admin: true,
      is_admin: true,
      name: "Admin User",
      first_name: "Farjad",
      last_name: "Akbar",
      job_title: "Full Stack Developer",
      password: adminHashedPassword, // Use hashed password
      username: "admin",
      userStatus: "ACTIVE",
    },
  });

  console.log("Admin user created:", admin);

  const user = await prisma.users.create({
    data: {
      account_name: "User Account",
      avatar: null,
      email: "user@example.com",
      is_account_admin: false,
      is_admin: false,
      name: "Regular User",
      password: userHashedPassword, // Use hashed password
      username: "user",
      userStatus: "ACTIVE",
    },
  });

  console.log("Regular user created:", user);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminHashedPassword = await bcrypt.hash("securepassword123", 10);
  const userHashedPassword = await bcrypt.hash("userpassword123", 10);

  const admin = await prisma.users.create({
    data: {
      avatar: null,
      email: "admin@example.com",
      is_admin: true,
      name: "Admin User",
      first_name: "Farjad",
      last_name: "Akbar",
      password: adminHashedPassword, // Use hashed password
      username: "admin",
      userStatus: "ACTIVE",
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin);

  const user = await prisma.users.create({
    data: {
      avatar: null,
      email: "user@example.com",
      is_admin: false,
      name: "Regular User",
      password: userHashedPassword, // Use hashed password
      username: "user",
      userStatus: "ACTIVE",
      role: "DEVELOPER",
    },
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const availabilityPromises = days.map((day) => {
    return prisma.availability.create({
      data: {
        day: day,
        fromTime: "08:00",
        tillTime: "18:00",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  });

  await Promise.all(availabilityPromises);

  const availabilityAdminPromises = days.map((day) => {
    return prisma.availability.create({
      data: {
        day: day,
        fromTime: "08:00",
        tillTime: "18:00",
        user: {
          connect: {
            id: admin.id,
          },
        },
      },
    });
  });

  await Promise.all(availabilityAdminPromises);
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

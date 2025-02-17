import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing records
  await prisma.location.deleteMany({});

  // Sample locations
  const locations = [
    {
      name: "Enoggra",
      slug: "enoggra",
      organizationId: "org_2rcDzOAeZ1khUtDYZb4QsyP9X6Y",
    },
  ];

  await prisma.location.createMany({
    data: locations,
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing records
  await prisma.location.deleteMany({});

  await prisma.location.createMany({
    data: [
      {
        name: "Enoggera",
        slug: "enoggera",
        organizationId: "org_2rcDzOAeZ1khUtDYZb4QsyP9X6Y",
      },
      {
        name: "Morningside",
        slug: "morningside",
        organizationId: "org_2rcDzOAeZ1khUtDYZb4QsyP9X6Y",
      },
    ],
  });

  const enoggera = await prisma.location.findFirstOrThrow({
    where: { slug: "enoggera" },
  });

  await prisma.route.createMany({
    data: [
      {
        grade: "VB",
        color: "yellow",
        sector: "cove",
        x: 100,
        y: 100,
        locationOrganizationId: enoggera.organizationId,
        locationSlug: enoggera.slug,
      },
      {
        grade: "V3",
        color: "green",
        sector: "prow",
        x: 200,
        y: 100,
        locationOrganizationId: enoggera.organizationId,
        locationSlug: enoggera.slug,
      },
    ],
  });

  const yellowRoute = await prisma.route.findFirstOrThrow({
    where: { color: "yellow" },
  });

  await prisma.log.create({
    data: {
      status: "FLASH",
      userId: "user_2qCgSa9zwR9Vywd4skID4fcDiL2",
      routeId: yellowRoute.id,
    },
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

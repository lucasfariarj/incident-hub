const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const incidents = [
  {
    title: "Payment API instability",
    description: "The payment API is intermittently failing to process transactions.",
    severity: "CRITICAL",
    status: "OPEN",
    assignee: "Ana",
  },
  {
    title: "Reconciliation delay",
    description: "Daily reconciliation job is running significantly behind schedule.",
    severity: "HIGH",
    status: "INVESTIGATING",
    assignee: "Bruno",
  },
  {
    title: "Incorrect customer notification",
    description: "Customers received a notification with incorrect order details.",
    severity: "MEDIUM",
    status: "RESOLVED",
    assignee: "Carla",
  },
];

async function main() {
  for (const incident of incidents) {
    await prisma.incident.create({ data: incident });
  }
  console.log(`Banco populado com ${incidents.length} incidentes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

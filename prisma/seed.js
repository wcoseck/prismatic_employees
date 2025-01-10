const prisma = require("./index");

const seed = async () => {
  const employees = [];
  for (let i = 0; i < 10; i++) {
    employees.push({ name: `Employee ${i}` });
  }

  await prisma.employee.createMany({
    data: employees,
  });
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

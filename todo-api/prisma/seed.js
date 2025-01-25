const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const sampleTodos = [
    {
      title: "Learn Express.js",
      completed: true
    },
    {
      title: "Build REST API",
      completed: false
    },
    {
      title: "Study Prisma ORM",
      completed: false
    },
    {
      title: "Complete project documentation",
      completed: false
    },
    {
      title: "Setup development environment",
      completed: true
    }
  ]

  for (const todo of sampleTodos) {
    await prisma.todo.create({
      data: todo
    })
  }

  console.log('Sample data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

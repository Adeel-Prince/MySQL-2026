import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// 1. Pass connection options directly into the adapter (No manual pool code!)
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",       // Replace with your real username (e.g., "root")
  password: "", // Replace with your real database password
  database: "", // Replace with your real database name
});

// 2. Supply the valid adapter instance to clear the engine initialization check
const prisma = new PrismaClient({ adapter });

const main = async () => {

    // 1) Here we have Create Method.............

//   console.log("Attempting database insert...");
//   const user = await prisma.user.create({
//     data: {
//       name: "Adeel",
//       email: "adeel1@gmail.com",
//     },
//   });
//   console.log("🎉 User created successfully:", user);

// now we insert multiple users........

// const newUsers = await prisma.user.createMany({
//     data: [
//         {name: "Ahmad", email: "ahmad45@gmail.com"},
//         {name: "Alina", email: "alina5@gmail.com"},
//     ],
// })
//   console.log(newUsers);


// 2) Here we have Read Method...................

//    const users = await prisma.user.findMany();
//    console.log(users);

// 3) Here is the Update Method.................

//    const updatedUser = await prisma.user.update({
//     where : {id: 3},
//     data: {name: "Alina G"},
//    })
//    console.log(updatedUser);


// 4) Here is the Deleted Method..................

   const deletedUser = await prisma.user.delete({
    where : {id : 2},
   })
   console.log(deletedUser);
};

main()
  .catch((e) => console.error("❌ Execution Error:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });

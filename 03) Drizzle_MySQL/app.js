import { eq } from "drizzle-orm";
import {db}  from "./config/db.js";
import {usersTable} from "./drizzle/schema.js";


const main = async () =>{
    // here we insert single user...........
    // const insertUser = await db.insert(usersTable).values({
    //     name: "Adeel", age: "24", email: "adeel2@mail.com"
    // });

    // here we insert multiple users.............
    // const insertUser = await db.insert(usersTable).values([
    //     {name: "Adeel Ahmad", age: "22", email: "adeel12@mail.com"},
    //     {name: "Alina", age: "28", email: "alina@mail.com"},
    //     {name: "Hassan", age: "22", email: "hassan@mail.com"},
    // ])
    // console.log(insertUser)

    // here we have 2nd method Read..............

    // const users = await db.select().from(usersTable);
    // console.log(users);


    // here we have 3rd method Update..............

    // const updatedUser = await db.update(usersTable)
    // .set({name: "Adii"})
    // .where(eq(usersTable.email, "adeel12@mail.com"));
    
    // console.log(updatedUser);

    // here we have 4th method Delete.............

    await db.delete(usersTable).where(eq(usersTable.email, "adeel12@mail.com"));

}

main().catch((error) => {
    console.log(error);
})
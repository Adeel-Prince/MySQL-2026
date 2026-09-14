import mysql from "mysql2/promise";

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Enter your Database Password here",
    database: "Enter Your Datbase Name here",
});


// await db.execute(`create database mysql_db`);

// console.log(await db.execute("show databases"));

console.log("MySQL Connected Successfully");

// now create a table............
// await db.execute(`
//     CREATE TABLE users(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(100) NOT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE
//     );
//     `)

// const values = [
// ["Hassan", "hassan@gmail.com"],
// ["Alina", "alina@gmail.com"],
// ["Alishba", "alisho@gmail.com"],
// ["Alice", "alice@gmail.com"],
// ]


// perfome CURD methods 
    // await db.execute(`
    //     insert into users(username, email) values("Adeel", "adii1@email.com")
    //     `);

    // await db.query("insert into users(username, email) value ?", [values]);

    // now by using prepared statement best practices........
    // await db.execute(`insert into users(username, email) values(?,?)`, [
    //     "Adii",
    //     "adii90@gmail.com",
    // ]);

// now read method.............
const [rows] = await db.execute(`select * from users`);
console.log(rows);


// update method................

// try {
//     const [rows] = await db.execute(
//         "update users set username= 'Adii Ahmad' where email= 'adii90@gmail.com'"
//     );
//     console.log("All Users: ", rows);
    
// } catch (error) {
//     console.error(error);
// }


// delete methods......................

// try {
//     const [rows] = await db.execute(
//         "DELETE FROM users where email= 'adii90@gmail.com'"
//     );
//     console.log("All users: ", rows);
    
// } catch (error) {
//     console.error(error);
    
// }
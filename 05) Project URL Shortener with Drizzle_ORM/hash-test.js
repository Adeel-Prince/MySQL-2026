// import bcrypt from "bcrypt";
import argon2 from "argon2";

async function hashPassword(password) {
    // return bcrypt.hash(password, 12)
    return argon2.hash(password)
    
}

async function verifyPassword(password, hashPassword) {
    // return bcrypt.compare(password, hashPassword);
    return argon2.verify(hashPassword, password);
}

const password1 = Array.from({length: 93}).fill("x").join("");
const password2 = Array.from({length: 93}).fill("x").join("") + Math.random();

const hashPassword1 = await hashPassword(password1);
const hashPassword2 = await hashPassword(password2);

console.log("1 - 1", await verifyPassword(password1, hashPassword1));
console.log("2 - 1", await verifyPassword(password2, hashPassword1));
console.log("2 - 2", await verifyPassword(password2, hashPassword2));
console.log("1 - 2", await verifyPassword(password1, hashPassword2));



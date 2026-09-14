import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'


const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",       // Replace with your real username (e.g., "root")
  password: "", // Replace with your real database password
  database: "", // Replace with your real database name
});


const prisma = new PrismaClient({adapter});
export const loadLinks = async () =>{
    const allShortLinks = await prisma.shortlink.findMany();
    return allShortLinks;
}

export const getLinkByShortCode = async (shortcode) =>{
   
    const shortLink = await prisma.shortlink.findUnique({
        where: {shortCode: shortcode},
    });
    return shortLink;
}

export const insertShortLink = async ({url, shortCode}) =>{
   const newShortLink = await prisma.shortlink.create({
    data: {shortCode, url},
   });
   return newShortLink;
}
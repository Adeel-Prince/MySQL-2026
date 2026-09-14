// import {readFile , writeFile} from  "fs/promises";
// import path from "path";


// const DATA_FILE = path.join("data", "links.json");

// export const loadLinks = async () =>{
//     try {
//         const data = await readFile(DATA_FILE, "utf-8");
//         return JSON.parse(data);
//     } catch (error) {
//         if (error.code === "ENOENT"){
//         await writeFile(DATA_FILE, JSON.stringify({}));
//         return {};
//         }
//         throw error;
//     }
    
// };

// export const saveLinks = async (links) =>{
//     await writeFile(DATA_FILE, JSON.stringify(links));
// };


// new version of code by using MongoDB Database...........

// import {dbClient} from "../config/db_client.js";
// import {env} from  "../config/env.js";


// const db = dbClient.db(env.MONGODB_DATABASE_NAME);
// const shortenerCollection = db.collection("shortener");

//  here we use new version of code with MySQL Queries...........

import {db} from "../config/db_client.js";

export const loadLinks = async () =>{
    // return shortenerCollection.find().toArray();
    const [rows] = await db.execute("select * from short_links");
    return rows;
}

export const insertShortLink = async ({url, shortCode}) =>{
    // return shortenerCollection.insertOne(link);
    const [result] = await db.execute("insert into short_links(short_code , url) values(?,?)", [shortCode, url]

    );
    return result;
}

export const getLinkByShortCode = async (shortcode) =>{
    // return await shortenerCollection.findOne({shortCode : shortcode});

    const [rows] = await db.execute("select * from short_links where short_code = ?", 
        [shortcode]
    );
    if (rows.length > 0){
        return rows[0];
    } else{
        return null;
    }

}
// import {readFile} from  "fs/promises";
import crypto from "crypto";
// import path from "path";
import {loadLinks, insertShortLink, getLinkByShortCode} from "../models/shortener.model.js"
// import { url } from "zod";


export const getShortenerPage =  async (req , res ) =>{
    try {
        const links =  await loadLinks();

        return res.render("index", {
            links,
            host: req.host,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export const postURLShortener = async (req , res ) =>{
    try {
        const {url , shortCode} = req.body;
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        // const links = await loadLinks();
         const link = await getLinkByShortCode(shortCode);
        // const links = await urls.find();

        if (link){
            return res.status(400).send("Short Code already exists. Please choose another.");
        }

        // links[finalShortCode] = url;
        // await saveLinks(links);

        // await saveLinks({url, shortCode});
        // await urls.create({url, shortCode});
        await insertShortLink({url, shortCode: finalShortCode});


        return res.redirect("/");
    } 
    
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export const redirectToShortLink =  async (req , res) =>{
    try {
        const {shortCode} = req.params;
        // const links = await loadLinks();

        const link = await getLinkByShortCode(shortCode);
        // const link = await urls.findOne({shortCode: shortCode});

        // if (!links[shortCode]) return res.status(404).send("404 error occurred");
        if (!link) return res.redirect("/404");

        return res.redirect(link.url);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
        
    }
}
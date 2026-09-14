// import {readFile} from  "fs/promises";
import crypto from "crypto";
// import path from "path";
// import { insertShortLink, getLinkByShortCode} from "../models/shortener.model.js"
import { getAllShortLinks, insertShortLink, getShortLinkByShortCode, findShortLinkById, deleteShortCodeById } from "../services/shortener.services.js";
import z from "zod";
// import { url } from "zod";


export const getShortenerPage =  async (req , res ) =>{
    try {
        // const links =  await loadLinks();
        if (!req.user) return res.redirect("/login");
        const links = await getAllShortLinks(req.user.id);

        // let isLoggedIn = req.headers.cookie;
        // isLoggedIn = Boolean(
        // isLoggedIn
        // ?.split(";")
        // ?.find((cookie) => cookie.trim().startsWith("isLoggedIn"))
        // ?.split("=")[1]
        // )
        // console.log("page login in: ", isLoggedIn);
    //    let isLoggedIn =  req.cookies.isLoggedIn;
    //    console.log(isLoggedIn);

        return res.render("index", {
            links,
            host: req.host,
            errors: req.flash("errors")
            //  isLoggedIn
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

export const postURLShortener = async (req , res ) =>{
    try {
         if (!req.user) return res.redirect("/login");
        const {url , shortCode} = req.body;
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        // const links = await loadLinks();
         const link = await getShortLinkByShortCode(finalShortCode);
        // const links = await urls.find();

        if (link){
            // return res.status(400).send("Short Code already exists. Please choose another.");
            req.flash(
                "errors",
                "Short Code already exists. Please choose another."
            );
            res.redirect("/");
        }

        // links[finalShortCode] = url;
        // await saveLinks(links);

        // await saveLinks({url, shortCode});
        // await urls.create({url, shortCode});
        // await insertShortLink({url, shortCode: finalShortCode});

        await insertShortLink({url , finalShortCode , userId: req.user.id});


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

       const link = await getShortLinkByShortCode(shortCode);
    //    console.log("links: ", link);
        // const link = await urls.findOne({shortCode: shortCode});

        // if (!links[shortCode]) return res.status(404).send("404 error occurred");
        if (!link) return res.redirect("/404");

        return res.redirect(link.url);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
        
    }
}

export const getShortenerEditPage = async (req, res) =>{
    if (!req.user) return res.redirect("/login");
    const {data: id, error} = z.coerce.number().int().safeParse(req.params.id);
    if (error) return res.redirect("/404");

    try {
        const shortLink = await findShortLinkById(id);
         if (!shortLink) return res.redirect("/404");

         res.render("edit-shortLink", {
            id: shortLink.id,
            url: shortLink.url,
            shortCode: shortLink.shortCode,
            errors: req.flash("errors"),
         });

    } catch (err) {
        console.error(err);
        return res.status(505).send("Internal server error");

        
    }
}

export const deleteShortCode = async (req, res) => {
    try {
       const {data: id, error} = z.coerce.number().int().safeParse(req.params.id);
    if (error) return res.redirect("/404");

    await deleteShortCodeById(id);
    return res.redirect("/");
    } catch (err) {
        console.error(err);
        return res.status(505).send("Internal server error");
    }
}
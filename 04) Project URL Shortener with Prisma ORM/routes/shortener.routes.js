import {Router} from "express";
import {postURLShortener, getShortenerPage, redirectToShortLink} from "../controllers/postshortener.controller.js"

const router = Router();
router.get("/" , getShortenerPage);
router.post("/", postURLShortener);
router.get("/:shortCode" , redirectToShortLink);

// Dafault Exports....
// export default router;
// but we prefer named exports like for larger project or multiple routes.......
export const shortenerRoutes = router;
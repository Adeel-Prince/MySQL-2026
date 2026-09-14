import {Router} from "express";
import {postURLShortener, getShortenerPage, redirectToShortLink, getShortenerEditPage, deleteShortCode} from "../controllers/postshortener.controller.js"

const router = Router();
router.get("/" , getShortenerPage);
router.post("/", postURLShortener);
router.get("/:shortCode" , redirectToShortLink);

router.route("/edit/:id").get(getShortenerEditPage);
router.route("/delete/:id").post(deleteShortCode);

// Dafault Exports....
// export default router;
// but we prefer named exports like for larger project or multiple routes.......
export const shortenerRoutes = router;
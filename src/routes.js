import { Router } from "express";
import { userController } from "./database/userController.js";

const router = Router();


// router.get('/categories', null); // IMAGE CATEGORIES

// router.get('/images', null); // GET LATEST IMAGES BY PAGE AND LIMIT
// router.get('/images/search', null); // SEARCH IMAGES BY TAGS OR NAME
// router.get('/images/:id', null); // IMAGE BY ID
// router.post('/images', null); // IMAGE CREATOR | AUTH ONLY

// router.post('/like/:id', null) // SET LIKE FOR THE IMAGE | AUTH ONLY

// router.get('/user', null); // USER INFO | AUTH ONLY
// router.get('/user/likes', null); // USER LIKES BY PAGE AND LIMIT | AUTH ONLY

router.post('/login', userController.login); // USER LOGIN
// router.post('/registration', null); // USER REGISTRATION


export default router;

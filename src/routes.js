import { Router } from "express";
import { userController } from "./database/userController.js";
import { body } from "express-validator";
import { maxLengths } from "./config.js";

const router = Router();


// router.get('/categories', null); // IMAGE CATEGORIES

// router.get('/images', null); // GET LATEST IMAGES BY PAGE AND LIMIT
// router.get('/images/random', null); // GET RANDOM IMAGE (FIX)
// router.get('/images/search', null); // SEARCH IMAGES BY TAGS OR NAME
// router.get('/images/:id', null); // IMAGE BY ID
// router.post('/images', null); // IMAGE CREATOR | AUTH ONLY

// router.post('/like/:id', null) // SET LIKE FOR THE IMAGE | AUTH ONLY

// router.get('/user', null); // USER INFO | AUTH ONLY
// router.get('/user/likes', null); // USER LIKES BY PAGE AND LIMIT | AUTH ONLY
// router.post('/user/avatar', null); // UPLOAD USER AVATAR | AUTH ONLY

router.post('/login',
    [body('username').notEmpty(),
    body('password').notEmpty()],
    userController.login); // USER LOGIN

router.post('/registration',
    [body('username').notEmpty().isLength({ min: maxLengths.username.min, max: maxLengths.username.max }),
    body('password').notEmpty().isLength({ min: maxLengths.password.min, max: maxLengths.password.max })],
    userController.registration); // USER REGISTRATION


export default router;
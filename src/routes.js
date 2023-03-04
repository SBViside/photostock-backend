import { Router } from "express";
import { authController } from "./controllers/authController.js";
import { body } from "express-validator";
import { authOnlyMiddleware } from "./middlewares/authOnlyMiddleware.js";
import userController from "./controllers/userController.js";

const router = Router();


// router.get('/categories', null); // IMAGE CATEGORIES

// router.get('/images', null); // GET LATEST IMAGES BY PAGE AND LIMIT
// router.get('/images/random', null); // GET RANDOM IMAGE (FIX)
// router.get('/images/search', null); // SEARCH IMAGES BY TAGS OR NAME
// router.get('/images/:id', null); // IMAGE BY ID
// router.post('/images', null); // IMAGE CREATOR | AUTH ONLY

// router.post('/like/:id', null) // SET LIKE FOR THE IMAGE | AUTH ONLY

router.get('/user', [authOnlyMiddleware], userController.getInfo); // USER INFO | AUTH ONLY
// router.get('/user/likes', null); // USER LIKES BY PAGE AND LIMIT | AUTH ONLY
// router.post('/user/avatar', null); // UPLOAD USER AVATAR | AUTH ONLY

router.post('/login',
    [body('username').notEmpty(),
    body('password').notEmpty()],
    authController.login); // USER LOGIN

router.post('/registration',
    [body('username').notEmpty().isLength({ min: process.env.USERNAME_MIN_LENGTH, max: process.env.USERNAME_MAX_LENGTH }),
    body('password').notEmpty().isLength({ min: process.env.PASSWORD_MIN_LENGTH, max: process.env.PASSWORD_MAX_LENGTH })],
    authController.registration); // USER REGISTRATION

router.get('/refresh', [authOnlyMiddleware], authController.refresh); // REFRESH TOKENS
router.get('/logout', [authOnlyMiddleware], authController.logout); // LOGOUT


export default router;

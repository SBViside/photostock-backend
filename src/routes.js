import { Router } from "express";
import { body, check } from "express-validator";
import { authController } from "./controllers/authController.js";
import { authOnlyMiddleware } from "./middlewares/authOnlyMiddleware.js";
import userController from "./controllers/userController.js";
import imageController from "./controllers/imageController.js";
import { httpFileExists, httpFileIsImage } from "./modules/validation.js";

const router = Router();

router.get('/images/tags', imageController.tags); // REVIEW IMAGE TAGS BY SIGNATURE

// router.get('/images', null); // FIXME GET LATEST IMAGES BY PAGE 
// router.get('/images/random', null); // FIXME GET RANDOM IMAGE (FIX)
// router.get('/images/search', null); // FIXME SEARCH IMAGES BY TAGS OR NAME
// router.get('/images/:id', null); // FIXME IMAGE BY ID
// router.post('/images', null); // FIXME IMAGE CREATOR | AUTH ONLY
// router.post('/images/like/:id', null) // FIXME SET LIKE FOR THE IMAGE | AUTH ONLY
router.get('/images/user/:id', imageController.userImages); // USER IMAGES BY PAGE

router.get('/user', [authOnlyMiddleware], userController.getInfo); // REVIEW USER INFO | AUTH ONLY
// router.get('/user/likes', null); // FIXME USER LIKES BY PAGE | AUTH ONLY
router.post('/user/avatar', [authOnlyMiddleware,
    check('avatar')
        .custom(httpFileExists)
        .custom(httpFileIsImage)
], userController.uploadAvatar); // REVIEW UPLOAD USER AVATAR | AUTH ONLY

router.post('/login',
    [body('username').notEmpty(),
    body('password').notEmpty()],
    authController.login); // REVIEW USER LOGIN

router.post('/registration',
    [body('username').notEmpty().isLength({ min: process.env.USERNAME_MIN_LENGTH, max: process.env.USERNAME_MAX_LENGTH }),
    body('password').notEmpty().isLength({ min: process.env.PASSWORD_MIN_LENGTH, max: process.env.PASSWORD_MAX_LENGTH })],
    authController.registration); // REVIEW USER REGISTRATION

router.get('/refresh', [authOnlyMiddleware], authController.refresh); // REVIEW REFRESH TOKENS
router.get('/logout', [authOnlyMiddleware], authController.logout); // REVIEW LOGOUT

export default router;

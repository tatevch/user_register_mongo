import express from "express";
import UsersController from "../controllers/UsersController";
const router = express.Router();

router.post('/register',UsersController.register);
router.get('/login',UsersController.login);
router.put('/user-update',UsersController.updateUser);
router.delete('/user-delete',UsersController.userDelete);
export default router;

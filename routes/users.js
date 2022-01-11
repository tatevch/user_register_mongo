import express from "express";
import UsersController from "../controllers/UsersController";
const router = express.Router();

router.post('/register',UsersController.register);
router.post('/login',UsersController.login);
router.get('/list',UsersController.getAllUsers);
router.put('/user-update',UsersController.updateUser);
router.put('/many-users-update',UsersController.updateManyUsers);
router.delete('/user-delete',UsersController.userDelete);
export default router;

import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";

export const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
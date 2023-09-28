import { Request, Response } from "express";
import { loginSchema, registrationSchema } from "../utils/schemas";
import { insertUserQuery, getUserWithUsername, getUserWithEmail, updateUserLastLogin } from "../utils/dbQueries";
import {v4 as uuid } from 'uuid';
import { User } from "../utils/types";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY!;


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password, password2, email } = registrationSchema.parse(req.body);

        const existingUsername = await getUserWithUsername.get({ $username: username });
        if (existingUsername) {
            return res.status(409).json({ message: "That username already exists" });
        }

        const existingEmail = await getUserWithEmail.get({ $email: email });
        if (existingEmail) {
            return res.status(409).json({ message: "That email is already registered" });
        }

        const id = uuid();
        const hashedPassword = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 4,
        });

        insertUserQuery.values({ $id: id, $username: username.trim(), $password: hashedPassword, $email: email });

        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        if (error instanceof ZodError) {
            const errorDetails = error.issues.map((issue) => issue.message);
            return res.status(400).json({ message: "Validation error", error: errorDetails });
        }

        console.error("Error registering user: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = loginSchema.parse(req.body);

        const user = await getUserWithUsername.get({ $username: username }) as User;
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const passwordMatch = await Bun.password.verify(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const tokenPayload = {
            userId: user.id,
            username: username
        }
        const accessToken = jwt.sign(
            tokenPayload,
            secretKey,
            { expiresIn: '24h' }
        );

        updateUserLastLogin.run({ $id: user.id })

        return res.status(200).json({ message: "Login successful", token: accessToken });

    } catch (error) {
        if (error instanceof ZodError) {
            const errorDetails = error.issues.map((issue) => issue.message);
            return res.status(400).json({ message: "Validation error", error: errorDetails });
        }

        console.error("Error with user login: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
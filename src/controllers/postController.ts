import { Request, Response } from "express";
import { getAllPostsQuery, createNewPost } from "../utils/dbQueries";
import { AllPosts } from "../utils/types";
import { createPostSchema } from "../utils/schemas";
import { ZodError } from "zod";


export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const cursor = req.query.cursor as string;

        const posts = getAllPostsQuery.all(parseInt(cursor)) as AllPosts[];
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].post_id : null;

        return res.status(200).json({
            posts,
            nextCursor
        });
        
    } catch (error) {
        console.error("Error fetching posts: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { content } = createPostSchema.parse(req.body);
        const userId = req.decodedToken.userId;

        createNewPost.run({ $user: userId, $content: content });

        return res.sendStatus(201);

    } catch (error) {
        if (error instanceof ZodError) {
            const errorDetails = error.issues.map((issue) => issue.message);
            return res.status(400).json({ message: "Validation error", error: errorDetails });
        }

        console.error("Error creating a new post: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
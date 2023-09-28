import { Request, Response } from "express";
import { createCommentSchema } from "../utils/schemas";
import { createNewComment, getCommentsForPost } from "../utils/dbQueries";
import { ZodError } from "zod";
import { get } from "mongoose";


export const addComment = async(req: Request, res: Response) => {
    try {
        const { content, postId } = createCommentSchema.parse(req.body);

        createNewComment.run({ 
            $user_id: req.decodedToken.userId,
            $post_id: postId,
            $content: content
        })

        return res.sendStatus(201);

    } catch (error) {
        if (error instanceof ZodError) {
            const errorDetails = error.issues.map((issue) => issue.message);
            return res.status(400).json({ message: "Validation error", error: errorDetails });
        }

        console.error("Create new comment error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCommentsWithPostId = async(req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const comments = getCommentsForPost.all({ $postId: postId });
        
        return res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments with post id :", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
import { Router } from "express";
import { validateTokenMiddleware } from "../utils/middleware";
import { addComment, getCommentsWithPostId } from "../controllers/commentController";


export const commentRouter = Router();

commentRouter.post('/', validateTokenMiddleware, addComment);
commentRouter.get('/:postId', validateTokenMiddleware, getCommentsWithPostId);
import { Router } from 'express';
import { getAllPosts, createPost } from '../controllers/postController';
import { validateTokenMiddleware } from '../utils/middleware';


export const postRouter = Router();

postRouter.get('/all', validateTokenMiddleware, getAllPosts);
postRouter.post('/', validateTokenMiddleware, createPost);
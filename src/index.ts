import express, { Request, Response } from "express";
import { authRouter } from "./routers/authRouter";
import { postRouter } from "./routers/postRouter";
import { commentRouter } from "./routers/commentRouter";


export const app = express();
const PORT = parseInt(process.env.EXPRESS_PORT!) || 3000;


app.get('/', (req: Request, res: Response) => {
    return res.send("<h1>Hello, World!</h1>");
})

app.use(express.json());
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
});
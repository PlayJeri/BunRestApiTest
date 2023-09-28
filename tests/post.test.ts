import { expect, test, describe } from "bun:test";
import request from "supertest";
import { app } from "../src/index";
import { testAccessToken } from "./setupTests";


let cursor = 0;

describe("Post routes", () => {
    test("should create a new post", async () => {
        const response = await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({
                content: "test post content"
            });
        expect(response.status).toBe(201);
    })

    test("should return 401 when authorization token is missing", async () => {
        const response = await request(app)
            .post('/post')
            .send({
                content: "test post content"
            });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid or missing token');
        expect(response.body.error).toBe('Unauthorized');
    });
    
    test("should return 400 with validation errors for invalid input", async () => {
        const response = await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({
                content: ""
            });
        expect(response.status).toBe(400);
    });

    test("should return all posts", async () => {
        const response = await request(app)
            .get('/post/all')
            .set('Authorization', `Bearer ${testAccessToken}`);

        cursor = response.body.nextCursor

        expect(response.status).toBe(200);
        expect(response.body.posts).toHaveLength(10);
    })
    
    test("should return posts with next cursor id", async () => {
        const response = await request(app)
            .get(`/post/all?cursor=${cursor}`)
            .set('Authorization', `Bearer ${testAccessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.posts[0].post_id).toBe(cursor - 1);
    })
})

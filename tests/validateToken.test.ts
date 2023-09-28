import { expect, test, describe } from "bun:test";
import request from 'supertest';
import { app } from "../src/index";
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY!;


describe("Validate Token Middleware", () => {
    test("should allow access with a valid token", async () => {
        const tokenPayload = {
            userId: 'testUserId',
            username: 'testUser'
        };
        const token = jwt.sign(tokenPayload, secretKey);

        const response = await request(app)
            .get('/post/all')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200); 
    });

    test("should reject access with an expired token", async () => {
        const expiredTokenPayload = {
            userId: 'testUserId',
            username: 'testUser',
            exp: Math.floor(Date.now() / 1000) - 3600, // Set expiration time to an hour ago
        };
        const expiredToken = jwt.sign(expiredTokenPayload, secretKey);

        const response = await request(app)
            .get('/post/all')
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token expired'); 
    });

    test("should reject access without a valid token", async () => {
        const response = await request(app)
            .get('/post/all')

        expect(response.status).toBe(401); 
        expect(response.body.error).toBe('Unauthorized'); 
        expect(response.body.message).toBe('Invalid or missing token'); 
    });
});

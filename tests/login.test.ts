import { expect, test, describe } from "bun:test";
import request from "supertest";
import { app } from "../src/index";


describe("User login", () => {
    test("Should return access token", async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                username: "fixtureUser",
                password: "testPassword",
            })

        expect(response.body.message).toBe("Login successful");
    })

    test("Should fail no user", async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                username: "notExistingUser",
                password: "doNotMatter",
            })

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid username or password');
    })

    test("Should fail wrong password", async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                username: "testUser",
                password: "wrongPassword", // Wrong password
            })

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid username or password');
    })
})
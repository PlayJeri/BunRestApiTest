import { afterAll, beforeAll } from "bun:test";
import request from "supertest";
import { app } from "../src/index";
import fs from "fs";


export let testAccessToken: string | null = null

beforeAll(async () => {
    console.log('Before all');
    await request(app).post('/auth/register').send({
        username: "fixtureUser",
        password: "testPassword",
        password2: "testPassword",
        email: "fixtureUser@email.com",
    })

    const response = await request(app).post('/auth/login').send({
        username: "fixtureUser",
        password: "testPassword"
    })
    testAccessToken = response.body.token;

    for (let i = 1; i <= 20; i++) {
        await request(app)
            .post('/post')
            .set('Authorization', `Bearer ${testAccessToken}`)
            .send({
                content: `test post ${i}`
            })
    }
})

afterAll(async () => {
    console.log('after all');
    if (fs.existsSync("test.db")) {
        console.log('exists after')
        fs.unlinkSync("test.db");
    }
})


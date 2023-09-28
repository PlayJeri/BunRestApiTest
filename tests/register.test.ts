import { expect, test, describe } from "bun:test";
import request from 'supertest';
import { app } from "../src/index";

describe("User registration", () => {
    test("should register a new user", async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: "testUser",
                password: "testPassword",
                password2: "testPassword",
                email: "testUser@email.com",
            })

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    })

    test("should fail with passwords don't match", async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: "testUser2",
                password: "testPassword",
                password2: "notMatchingPassword2", // Doesn't match password
                email: "testuser2@email.com",
            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation error');
        expect(response.body.error).toContain("Passwords don't match");
    })

    test("should fail with user already exists", async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: "testUser", // Username already exists
                password: "testPassword",
                password2: "testPassword",
                email: "testuser@email.com",
            })

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('That username already exists');
    })

    test("should fail with username too short", async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            username: "us", // Too short
            password: "testPassword",
            password2: "testPassword",
            email: "asdf@email.com",
          })
      
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation error');
        expect(response.body.error).toContain('Username must contain 3-16 characters');
      });
      
      test("should fail with username too long", async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            username: "verylongusername1234", // Too long
            password: "testPassword",
            password2: "testPassword",
            email: "testuser@email.com",
          })
      
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation error');
        expect(response.body.error).toContain('Username must contain 3-16 characters');
      });
      
      test("should fail with password too short", async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            username: "testUser",
            password: "short", // Too short
            password2: "short", // Too short
            email: "testuser@email.com",
          })
      
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation error');
        expect(response.body.error).toContain('Password must contain at least six (6) characters');
      });
      
      test("should fail with invalid email format", async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({
            username: "testUser",
            password: "testPassword",
            password2: "testPassword",
            email: "invalidemail", // Invalid email format
          })
      
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation error');
        expect(response.body.error).toContain('Make sure to enter a valid email');
      });      

      test("should fail with email already exists", async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: "newUsername",
                password: "testPassword",
                password2: "testPassword",
                email: "testUser@email.com", // Existing email
            })

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('That email is already registered');
    })
})

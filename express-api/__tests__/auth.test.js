const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create Express app
const app = express();
app.use(express.json());

// Import your router
const { usersRouter } = require('../routers/users');
app.use(usersRouter);

describe('Authentication Routes', () => {
    describe('POST /users (Register)', () => {
        it('should create a new user with valid data', async () => {
            const userData = {
                name: 'Test User',
                username: 'testuser' + Date.now(), // Make username unique
                password: 'password123',
                bio: 'Test bio'
            };

            const response = await request(app)
                .post('/users')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(userData.name);
            expect(response.body.username).toBe(userData.username);
            expect(response.body).not.toHaveProperty('password');
        });

        it('should return 400 if required fields are missing', async () => {
            const invalidUserData = {
                name: 'Test User',
                // username missing
                password: 'password123'
            };

            const response = await request(app)
                .post('/users')
                .send(invalidUserData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg');
        });
    });

    describe('POST /login', () => {
        let testUser;
        
        beforeEach(async () => {
            // Create a test user for login tests
            const password = await bcrypt.hash('testpass123', 10);
            
            testUser = await request(app)
                .post('/users')
                .send({
                    name: 'Login Test User',
                    username: 'logintest' + Date.now(),
                    password: 'testpass123',
                    bio: 'Test bio'
                });
        });

        it('should login successfully with valid credentials', async () => {
            const loginData = {
                username: testUser.body.username,
                password: 'testpass123'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('followersCount');
            expect(response.body.user).toHaveProperty('followingCount');

            // Verify JWT token
            const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
            expect(decoded).toHaveProperty('id');
            expect(decoded).toHaveProperty('username', loginData.username);
        });

        it('should return 404 for non-existent user', async () => {
            const loginData = {
                username: 'nonexistentuser',
                password: 'password123'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('msg', 'user not found');
        });

        it('should return 401 for invalid password', async () => {
            const loginData = {
                username: testUser.body.username,
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('msg', 'invalid password');
        });

        it('should return 400 if required fields are missing', async () => {
            const loginData = {
                username: testUser.body.username
                // password missing
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('msg');
        });
    });
});

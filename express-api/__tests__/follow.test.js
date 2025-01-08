const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Import your router
const { usersRouter } = require('../routers/users');
app.use(usersRouter);

const prisma = new PrismaClient();

describe('Follow/Unfollow Features', () => {
    let user1, user2, user1Token;

    beforeEach(async () => {
        // Create test users
        const password = await bcrypt.hash('password123', 10);
        
        user1 = await prisma.user.create({
            data: {
                name: 'User One',
                username: 'user1_' + Date.now(),
                password: password,
                bio: 'Test bio 1'
            }
        });

        user2 = await prisma.user.create({
            data: {
                name: 'User Two',
                username: 'user2_' + Date.now(),
                password: password,
                bio: 'Test bio 2'
            }
        });

        // Create auth token for user1
        user1Token = jwt.sign(
            { id: user1.id, username: user1.username },
            process.env.JWT_SECRET
        );
    });

    describe('Follow User', () => {
        it('should successfully follow another user', async () => {
            const response = await request(app)
                .post(`/users/${user2.id}/follow`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(response.status).toBe(200);
            
            // Verify the follow relationship in database
            const follow = await prisma.follow.findFirst({
                where: {
                    followerId: user1.id,
                    followingId: user2.id
                }
            });
            expect(follow).toBeTruthy();

            // Check follower count
            const user2WithCounts = await prisma.user.findUnique({
                where: { id: user2.id },
                include: {
                    followers: true,
                    follows: true
                }
            });
            expect(user2WithCounts.followers.length).toBe(1);
        });

        it('should prevent following yourself', async () => {
            const response = await request(app)
                .post(`/users/${user1.id}/follow`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Cannot follow yourself');
        });

        it('should prevent duplicate follows', async () => {
            // First follow
            await request(app)
                .post(`/users/${user2.id}/follow`)
                .set('Authorization', `Bearer ${user1Token}`);

            // Try to follow again
            const response = await request(app)
                .post(`/users/${user2.id}/follow`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Already following this user');
        });
    });

    describe('Unfollow User', () => {
        beforeEach(async () => {
            // Create a follow relationship
            await prisma.follow.create({
                data: {
                    followerId: user1.id,
                    followingId: user2.id
                }
            });
        });

        it('should successfully unfollow a user', async () => {
            const response = await request(app)
                .delete(`/users/${user2.id}/follow`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(response.status).toBe(200);

            // Verify the follow relationship is removed
            const follow = await prisma.follow.findFirst({
                where: {
                    followerId: user1.id,
                    followingId: user2.id
                }
            });
            expect(follow).toBeNull();

            // Check follower count
            const user2WithCounts = await prisma.user.findUnique({
                where: { id: user2.id },
                include: {
                    followers: true,
                    follows: true
                }
            });
            expect(user2WithCounts.followers.length).toBe(0);
        });

        it('should handle unfollowing a user you don\'t follow', async () => {
            // First unfollow
            await request(app)
                .delete(`/users/${user2.id}/follow`)
                .set('Authorization', `Bearer ${user1Token}`);

            // Try to unfollow again
            const response = await request(app)
                .delete(`/users/${user2.id}/follow`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Not following this user');
        });
    });

    describe('Get Follow Status', () => {
        it('should return correct follow status when following', async () => {
            // Create follow relationship
            await prisma.follow.create({
                data: {
                    followerId: user1.id,
                    followingId: user2.id
                }
            });

            const response = await request(app)
                .get(`/users/${user2.id}`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('isFollowing', true);
            expect(response.body).toHaveProperty('followerCount');
            expect(response.body).toHaveProperty('followingCount');
        });

        it('should return correct follow status when not following', async () => {
            const response = await request(app)
                .get(`/users/${user2.id}`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('isFollowing', false);
            expect(response.body).toHaveProperty('followerCount', 0);
        });
    });
});

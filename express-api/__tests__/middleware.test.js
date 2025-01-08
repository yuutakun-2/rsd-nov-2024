const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const { isPostOwner, isCommentOwner } = require('../middlewares/ownership');
const { auth } = require('../middlewares/auth');

// Mock routes for testing
app.delete('/posts/:id', auth, isPostOwner, (req, res) => {
    res.json({ success: true });
});

app.delete('/comments/:id', auth, isCommentOwner, (req, res) => {
    res.json({ success: true });
});

describe('Middleware Tests', () => {
    let user, otherUser, authToken, post, comment;

    beforeEach(async () => {
        // Create test users
        const password = await bcrypt.hash('password123', 10);
        
        user = await prisma.user.create({
            data: {
                name: 'Test User',
                username: 'testuser' + Date.now(),
                password: password,
                bio: 'Test bio'
            }
        });

        otherUser = await prisma.user.create({
            data: {
                name: 'Other User',
                username: 'otheruser' + Date.now(),
                password: password,
                bio: 'Other bio'
            }
        });

        // Create auth token
        authToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET
        );

        // Create a post owned by the test user
        post = await prisma.post.create({
            data: {
                content: 'Test post',
                userId: user.id
            }
        });

        // Create a comment owned by the test user
        comment = await prisma.post.create({
            data: {
                content: 'Test post for comment',
                userId: user.id
            }
        });

        const testComment = await prisma.comment.create({
            data: {
                content: 'Test comment',
                userId: user.id,
                postId: comment.id
            }
        });

        comment = testComment;
    });

    describe('isPostOwner Middleware', () => {
        it('should allow access when user owns the post', async () => {
            const response = await request(app)
                .delete(`/posts/${post.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
        });

        it('should deny access when user does not own the post', async () => {
            // Create a post owned by other user
            const otherPost = await prisma.post.create({
                data: {
                    content: 'Other user post',
                    userId: otherUser.id
                }
            });

            const response = await request(app)
                .delete(`/posts/${otherPost.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error', 'Not authorized');
        });

        it('should return 404 when post does not exist', async () => {
            const response = await request(app)
                .delete('/posts/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Post not found');
        });
    });

    describe('isCommentOwner Middleware', () => {
        it('should allow access when user owns the comment', async () => {
            const response = await request(app)
                .delete(`/comments/${comment.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
        });

        it('should deny access when user does not own the comment', async () => {
            // Create a post for the comment
            const commentPost = await prisma.post.create({
                data: {
                    content: 'Post for other comment',
                    userId: otherUser.id
                }
            });

            // Create a comment owned by other user
            const otherComment = await prisma.comment.create({
                data: {
                    content: 'Other user comment',
                    userId: otherUser.id,
                    postId: commentPost.id
                }
            });

            const response = await request(app)
                .delete(`/comments/${otherComment.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error', 'Not authorized');
        });

        it('should return 404 when comment does not exist', async () => {
            const response = await request(app)
                .delete('/comments/999999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Comment not found');
        });
    });

    afterAll(async () => {
        // Clean up test data
        await prisma.$transaction([
            prisma.notification.deleteMany(),
            prisma.like.deleteMany(),
            prisma.comment.deleteMany(),
            prisma.post.deleteMany(),
            prisma.follow.deleteMany(),
            prisma.user.deleteMany(),
        ]);
    });
});

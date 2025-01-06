const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { auth } = require("../middlewares/auth");

// Get latest notifications for auth user
router.get("/notifications", auth, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: res.locals.user.id
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        content: true
                    }
                }
            },
            orderBy: {
                created: 'desc'
            },
            take: 20
        });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a route to mark notifications as read
router.put("/notifications/read", auth, async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: {
                userId: res.locals.user.id,
                read: false
            },
            data: {
                read: true
            }
        });

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a route to mark individual notification as read
router.put("/notifications/:id/read", auth, async (req, res) => {
    const notificationId = parseInt(req.params.id);

    try {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        });

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        // Check if the notification belongs to the authenticated user
        if (notification.userId !== res.locals.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        content: true
                    }
                }
            }
        });

        res.json(updatedNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/verify", auth, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: res.locals.user.id },
        include: {
            _count: {
                select: {
                    followers: true,
                    follows: true
                }
            }
        }
    });

    // Remove password and add counts
    const { password, _count, ...userWithoutPassword } = user;
    res.json({
        ...userWithoutPassword,
        followersCount: _count.followers,
        followingCount: _count.follows
    });
});

router.get("/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: {
                    orderBy: { id: 'desc' },
                    include: {
                        user: true,
                        likes: true,
                        comments: {
                            include: { user: true }
                        }
                    }
                },
                follows: true,
                followers: true,
                _count: {
                    select: {
                        follows: true,
                        followers: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove password from response and add counts
        const { password, follows, followers, _count, ...userWithoutPassword } = user;
        res.json({
            ...userWithoutPassword,
            followingCount: _count.follows,
            followerCount: _count.followers,
            following: follows,
            followers
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get("/search", async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: q } },
                    { username: { contains: q } }
                ]
            },
            take: 10
        });

        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/users", async (req, res) => {
	const { name, username, bio, password } = req.body;
	if (!name || !username || !password) {
		return res
			.status(400)
			.json({ msg: "name, username and password are required" });
	}

    const hash = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: { name, username, bio, password: hash },
	});

	res.status(201).json(user);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: "username and password are required" });
    }

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            _count: {
                select: {
                    followers: true,
                    follows: true
                }
            }
        }
    });

    if (!user) {
        return res.status(404).json({ msg: "user not found" });
    }

    if (await bcrypt.compare(password, user.password)) {
        // Remove password and add counts
        const { password: _, _count, ...userWithoutPassword } = user;
        const userData = {
            ...userWithoutPassword,
            followersCount: _count.followers,
            followingCount: _count.follows
        };
        
        // Create token with just the necessary user data
        const tokenData = {
            id: user.id,
            name: user.name,
            username: user.username
        };

        res.json({
            token: jwt.sign(tokenData, process.env.JWT_SECRET),
            user: userData
        });
    } else {
        res.status(401).json({ msg: "invalid password" });
    }
});

// Follow a user
router.post("/users/:id/follow", auth, async (req, res) => {
    const followingId = parseInt(req.params.id);
    const followerId = res.locals.user.id;

    try {
        // Check if trying to follow self
        if (followerId === followingId) {
            return res.status(400).json({ error: "Cannot follow yourself" });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: followingId }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create follow relationship
        const follow = await prisma.follow.create({
            data: {
                followerId,
                followingId
            },
        });

        // Create notification for the user being followed
        await prisma.notification.create({
            data: {
                type: "FOLLOW",
                userId: followingId,
                actorId: followerId,
                read: false,
            }
        });

        res.json(follow);
    } catch (error) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Already following this user" });
        }
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Unfollow a user
router.delete("/users/:id/follow", auth, async (req, res) => {
    const followingId = parseInt(req.params.id);
    const followerId = res.locals.user.id;

    try {
        // Check if trying to unfollow self
        if (followerId === followingId) {
            return res.status(400).json({ error: "Cannot unfollow yourself" });
        }

        // Delete follow relationship
        const follow = await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        res.json(follow);
    } catch (error) {
        // Handle case when not following
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Not following this user" });
        }
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get user's followers
router.get("/users/:id/followers", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const followers = await prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true,
                    }
                }
            }
        });

        res.json(followers.map(f => f.follower));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get users that a user is following
router.get("/users/:id/following", async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true,
                    }
                }
            }
        });

        res.json(following.map(f => f.following));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = { usersRouter: router };
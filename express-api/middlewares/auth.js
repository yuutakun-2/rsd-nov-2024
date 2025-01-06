const express = require("express");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/***
 * @type {express.RequestHandler}
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function auth(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Get fresh user data with counts
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
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
            throw new Error('User not found');
        }
        
        // Add counts to user object
        res.locals.user = {
            ...user,
            followersCount: user._count.followers,
            followingCount: user._count.follows
        };
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ msg: "invalid token" });
    }
}

function isOwner(type) {
    return async (req, res, next) => {
        if(type === "post") {
            const id = req.params.id;
            const post = await prisma.post.findUnique({
                where: { id: Number(id) }
            });

            if (res.locals.user.id === post.userId) {
				return next();
			}
        }

        res.status(403).json({ msg: "forbidden" });
    };
}

module.exports = { auth, isOwner };

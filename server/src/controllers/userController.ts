import { Request, Response, NextFunction } from "express";
import { AppError } from "@src/utils/errorHandler";
import prisma from "@src/utils/client";
import bcrypt from "bcrypt";

export const createUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password, isAdmin, isModerator, isVerifiedPoster } = req.body;

        if (!name || !email || !password) {
            throw new AppError("Name, email, and password are required", 400);
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new AppError("User with this email already exists", 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isAdmin: isAdmin || false,
                isModerator: isModerator || false,
                isVerifiedPoster: isVerifiedPoster || false
            },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                isModerator: true,
                isVerifiedPoster: true,
                isBlocked: true,
                createdAt: true
            }
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const getUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                isModerator: true,
                isVerifiedPoster: true,
                isBlocked: true,
                createdAt: true,
                updatedAt: true,
                Blogs: {
                    select: {
                        id: true,
                        createdAt: true
                    }
                },
                Videos: {
                    select: {
                        id: true,
                        uploadedAt: true
                    }
                }
            }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            data: {
                ...user,
                role: user.isAdmin ? 'admin' : user.isModerator ? 'moderator' : 'user',
                isActive: !user.isBlocked,
                blogCount: user.Blogs.length,
                videoCount: user.Videos.length
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsersController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            role,
            isActive
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search as string } },
                { email: { contains: search as string } }
            ];
        }

        if (role) {
            switch (role) {
                case 'admin':
                    where.isAdmin = true;
                    break;
                case 'moderator':
                    where.isModerator = true;
                    where.isAdmin = false;
                    break;
                case 'user':
                    where.isAdmin = false;
                    where.isModerator = false;
                    break;
            }
        }

        if (isActive !== undefined) {
            where.isBlocked = isActive === 'true' ? false : true;
        }

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                skip,
                take,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isAdmin: true,
                    isModerator: true,
                    isVerifiedPoster: true,
                    isBlocked: true,
                    createdAt: true,
                    updatedAt: true,
                    Blogs: { select: { id: true } },
                    Videos: { select: { id: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        const formattedUsers = users.map(user => ({
            ...user,
            role: user.isAdmin ? 'admin' : user.isModerator ? 'moderator' : 'user',
            isActive: !user.isBlocked,
            blogCount: user.Blogs.length,
            videoCount: user.Videos.length
        }));

        res.status(200).json({
            success: true,
            data: {
                users: formattedUsers,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / take),
                    totalItems: total,
                    itemsPerPage: take,
                    hasNext: skip + take < total,
                    hasPrev: Number(page) > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, isAdmin, isModerator, isBlocked, isVerifiedPoster } = req.body;

        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
        if (isModerator !== undefined) updateData.isModerator = isModerator;
        if (isBlocked !== undefined) updateData.isBlocked = isBlocked;
        if (isVerifiedPoster !== undefined) updateData.isVerifiedPoster = isVerifiedPoster;

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                isModerator: true,
                isVerifiedPoster: true,
                isBlocked: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                ...user,
                role: user.isAdmin ? 'admin' : user.isModerator ? 'moderator' : 'user',
                isActive: !user.isBlocked
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        // First check if user exists
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        // Delete user and related records
        await prisma.$transaction([
            // Delete refresh tokens
            prisma.refreshToken.deleteMany({
                where: { userId: id }
            }),
            // Delete user
            prisma.user.delete({
                where: { id }
            })
        ]);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getUserStatisticsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { period = '7d' } = req.query;

        // Calculate date range
        const now = new Date();
        const startDate = new Date();

        switch (period) {
            case '24h':
                startDate.setHours(now.getHours() - 24);
                break;
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        const [
            totalUsers,
            activeUsers,
            newUsers,
            adminUsers,
            moderatorUsers,
            regularUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isBlocked: false } }),
            prisma.user.count({
                where: {
                    createdAt: { gte: startDate }
                }
            }),
            prisma.user.count({ where: { isAdmin: true } }),
            prisma.user.count({
                where: {
                    isModerator: true,
                    isAdmin: false
                }
            }),
            prisma.user.count({
                where: {
                    isAdmin: false,
                    isModerator: false
                }
            })
        ]);

        const statistics = {
            totalUsers,
            activeUsers,
            newUsersThisPeriod: newUsers,
            usersByRole: [
                { role: 'admin', count: adminUsers },
                { role: 'moderator', count: moderatorUsers },
                { role: 'user', count: regularUsers }
            ]
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        next(error);
    }
};

export const getBlogStatisticsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { period = '7d' } = req.query;

        // Calculate date range
        const now = new Date();
        const startDate = new Date();

        switch (period) {
            case '24h':
                startDate.setHours(now.getHours() - 24);
                break;
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        const [
            totalBlogs,
            recentBlogs,
            totalUsers,
            topAuthors
        ] = await Promise.all([
            prisma.blog.count(),
            prisma.blog.count({
                where: {
                    createdAt: { gte: startDate }
                }
            }),
            prisma.user.count(),
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    Blogs: { select: { id: true } }
                },
                where: {
                    Blogs: {
                        some: {}
                    }
                },
                orderBy: {
                    Blogs: {
                        _count: 'desc'
                    }
                },
                take: 5
            })
        ]);

        const averageBlogsPerUser = totalUsers > 0 ? Number((totalBlogs / totalUsers).toFixed(1)) : 0;

        const formattedTopAuthors = topAuthors.map(author => ({
            id: author.id,
            name: author.name || 'Unknown',
            blogCount: author.Blogs.length
        }));

        const statistics = {
            totalBlogs,
            blogsThisPeriod: recentBlogs,
            averageBlogsPerUser,
            topAuthors: formattedTopAuthors
        };

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        next(error);
    }
};

export const toggleUserStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: { isBlocked: true }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isBlocked: !user.isBlocked },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                isModerator: true,
                isBlocked: true
            }
        });

        res.status(200).json({
            success: true,
            message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: {
                ...updatedUser,
                role: updatedUser.isAdmin ? 'admin' : updatedUser.isModerator ? 'moderator' : 'user',
                isActive: !updatedUser.isBlocked
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getUserProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }

        // Get user profile with statistics
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                isAdmin: true,
                isModerator: true,
                isVerifiedPoster: true,
                isBlocked: true,
                _count: {
                    select: {
                        Blogs: {
                            where: { visible: 1 }
                        },
                        Videos: true
                    }
                }
            }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        // Get recent activity statistics
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [
            recentBlogs,
            recentVideos,
            weeklyBlogs,
            weeklyVideos,
            totalBlogViews
        ] = await Promise.all([
            prisma.blog.count({
                where: {
                    userId,
                    visible: 1,
                    createdAt: { gte: thirtyDaysAgo }
                }
            }),
            prisma.video.count({
                where: {
                    userId,
                    createdAt: { gte: thirtyDaysAgo }
                }
            }),
            prisma.blog.count({
                where: {
                    userId,
                    visible: 1,
                    createdAt: { gte: sevenDaysAgo }
                }
            }),
            prisma.video.count({
                where: {
                    userId,
                    createdAt: { gte: sevenDaysAgo }
                }
            }),
            // Mock blog views - you can implement actual view tracking later
            Promise.resolve(user._count.Blogs * Math.floor(Math.random() * 100) + 50)
        ]);

        // Calculate user achievements
        const achievements = [];
        if (user._count.Blogs >= 1) achievements.push({ name: "First Blog", icon: "📝", description: "Published your first blog post" });
        if (user._count.Blogs >= 5) achievements.push({ name: "Blogger", icon: "✍️", description: "Published 5 blog posts" });
        if (user._count.Blogs >= 10) achievements.push({ name: "Prolific Writer", icon: "🏆", description: "Published 10 blog posts" });
        if (user._count.Videos >= 1) achievements.push({ name: "Content Creator", icon: "🎥", description: "Uploaded your first video" });
        if (user.isVerifiedPoster) achievements.push({ name: "Verified", icon: "✅", description: "Verified content creator" });
        if (user.isModerator) achievements.push({ name: "Moderator", icon: "👮", description: "Community moderator" });
        if (user.isAdmin) achievements.push({ name: "Administrator", icon: "👑", description: "Platform administrator" });

        const profileData = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.isAdmin ? 'admin' : user.isModerator ? 'moderator' : 'user',
                isVerifiedPoster: user.isVerifiedPoster,
                isBlocked: user.isBlocked,
                isActive: !user.isBlocked
            },
            statistics: {
                totalBlogs: user._count.Blogs,
                totalVideos: user._count.Videos,
                recentBlogs,
                recentVideos,
                weeklyBlogs,
                weeklyVideos,
                totalBlogViews,
                accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
            },
            achievements
        };

        res.status(200).json({
            success: true,
            data: profileData
        });
    } catch (error) {
        next(error);
    }
};

export const getUserActivityController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { limit = 20 } = req.query;

        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }

        const limitNum = Math.min(parseInt(limit as string) || 20, 50);

        // Get recent blogs and videos
        const [recentBlogs, recentVideos] = await Promise.all([
            prisma.blog.findMany({
                where: { userId, visible: 1 },
                select: {
                    id: true,
                    subject: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' },
                take: Math.floor(limitNum / 2)
            }),
            prisma.video.findMany({
                where: { userId },
                select: {
                    id: true,
                    title: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' },
                take: Math.floor(limitNum / 2)
            })
        ]);

        // Combine and format activities
        const activities = [
            ...recentBlogs.map(blog => ({
                id: `blog-${blog.id}`,
                type: 'blog_created',
                title: blog.subject,
                createdAt: blog.createdAt,
                icon: '📝',
                description: `Published blog post "${blog.subject}"`
            })),
            ...recentVideos.map(video => ({
                id: `video-${video.id}`,
                type: 'video_uploaded',
                title: video.title,
                createdAt: video.createdAt,
                icon: '🎥',
                description: `Uploaded video "${video.title}"`
            }))
        ];

        // Sort by date and limit
        activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const limitedActivities = activities.slice(0, limitNum);

        res.status(200).json({
            success: true,
            data: limitedActivities
        });
    } catch (error) {
        next(error);
    }
};
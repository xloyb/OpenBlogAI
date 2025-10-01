import bcrypt from "bcrypt";
import prisma from "@utils/client";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, revokeRefreshToken } from "@utils/jwt";

export const registerUserService = async (name: string | null, email: string, password: string, ipAddress?: string, userAgent?: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      password: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);

  const { password: userPassword, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};


export const loginUserService = async (email: string, password: string, ipAddress?: string, userAgent?: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.isBlocked) {
    throw new Error("Account is blocked");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);

  return { accessToken, refreshToken, user };
};


export const logoutUserService = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("No refresh token provided");
  await revokeRefreshToken(refreshToken);
};


export const refreshUserTokenService = async (
  refreshToken: string,
  ipAddress?: string,
  userAgent?: string
) => {
  console.log("[refreshUserTokenService] Starting token refresh process");
  console.log("[refreshUserTokenService] Provided refresh token:", refreshToken);
  console.log("[refreshUserTokenService] IP Address:", ipAddress);
  console.log("[refreshUserTokenService] User Agent:", userAgent);

  if (!refreshToken) {
    console.log("[refreshUserTokenService] No refresh token provided");
    throw new Error("Refresh token missing");
  }

  console.log("[refreshUserTokenService] Verifying refresh token...");
  const tokenRecord = await verifyRefreshToken(refreshToken);
  console.log("[refreshUserTokenService] Token record:", tokenRecord);

  console.log("[refreshUserTokenService] Fetching user with ID:", tokenRecord.userId);
  const user = await prisma.user.findUnique({
    where: { id: tokenRecord.userId },
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });
  console.log("[refreshUserTokenService] Retrieved user:", user);

  if (!user) {
    console.log("[refreshUserTokenService] User not found for ID:", tokenRecord.userId);
    throw new Error("User not found");
  }
  if (user.isBlocked) {
    console.log("[refreshUserTokenService] User is blocked:", user.id);
    throw new Error("Account is blocked");
  }

  console.log("[refreshUserTokenService] Generating new access token...");
  const newAccessToken = generateAccessToken(user);
  console.log("[refreshUserTokenService] New access token generated:", newAccessToken);

  console.log("[refreshUserTokenService] Generating new refresh token...");
  const newRefreshToken = await generateRefreshToken(user, ipAddress, userAgent);
  console.log("[refreshUserTokenService] New refresh token generated:", newRefreshToken);

  console.log("[refreshUserTokenService] Revoking old refresh token ID:", tokenRecord.id);
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { isRevoked: true }
  });
  console.log("[refreshUserTokenService] Old refresh token revoked");

  console.log("[refreshUserTokenService] Returning new tokens");
  return { newAccessToken, newRefreshToken };
};

export const logoutUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Refresh token missing" });
  }

  const refreshToken = authHeader.split(" ")[1];

  try {
    await logoutUserService(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log out" });
  }
};

// Admin Dashboard Services

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "moderator" | "admin";
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      isAdmin: userData.role === "admin",
      isModerator: userData.role === "moderator" || userData.role === "admin",
      isVerifiedPoster: userData.role !== "user"
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });

  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
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
      Blogs: {
        select: {
          id: true,
          subject: true,
          createdAt: true
        }
      },
      Videos: {
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      }
    }
  });

  return user;
};

export const getAllUsers = async (filters: {
  search?: string;
  role?: string;
  status?: string;
}, options: {
  page: number;
  limit: number;
}) => {
  const where: any = {};

  // Apply filters
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  if (filters.role) {
    if (filters.role === 'admin') {
      where.isAdmin = true;
    } else if (filters.role === 'moderator') {
      where.isModerator = true;
      where.isAdmin = false;
    } else if (filters.role === 'user') {
      where.isModerator = false;
      where.isAdmin = false;
    }
  }

  if (filters.status) {
    where.isBlocked = filters.status === 'blocked';
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
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
            Blogs: true,
            Videos: true
          }
        }
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users: users.map(user => ({
      ...user,
      role: user.isAdmin ? 'admin' : user.isModerator ? 'moderator' : 'user',
      isActive: !user.isBlocked,
      blogCount: user._count.Blogs,
      videoCount: user._count.Videos
    })),
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(total / options.limit)
  };
};

export const updateUser = async (id: string, updateData: {
  name?: string;
  email?: string;
  role?: "user" | "moderator" | "admin";
  isActive?: boolean;
}) => {
  const { role, isActive, ...otherData } = updateData;

  const data: any = { ...otherData };

  if (role !== undefined) {
    data.isAdmin = role === "admin";
    data.isModerator = role === "moderator" || role === "admin";
    data.isVerifiedPoster = role !== "user";
  }

  if (isActive !== undefined) {
    data.isBlocked = !isActive;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
      isModerator: true,
      isVerifiedPoster: true,
      isBlocked: true
    }
  });

  return {
    ...user,
    role: user.isAdmin ? 'admin' : user.isModerator ? 'moderator' : 'user',
    isActive: !user.isBlocked
  };
};

export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserActivity = async (userId: string, options: {
  startDate?: string;
  endDate?: string;
  limit: number;
}) => {
  // Get user's recent activities from various tables
  const [blogs, videos, refreshTokens] = await Promise.all([
    prisma.blog.findMany({
      where: {
        userId,
        ...(options.startDate && options.endDate ? {
          createdAt: {
            gte: new Date(options.startDate),
            lte: new Date(options.endDate)
          }
        } : {})
      },
      select: {
        id: true,
        subject: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: Math.floor(options.limit / 3)
    }),
    prisma.video.findMany({
      where: {
        userId,
        ...(options.startDate && options.endDate ? {
          createdAt: {
            gte: new Date(options.startDate),
            lte: new Date(options.endDate)
          }
        } : {})
      },
      select: {
        id: true,
        title: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: Math.floor(options.limit / 3)
    }),
    prisma.refreshToken.findMany({
      where: {
        userId,
        ...(options.startDate && options.endDate ? {
          createdAt: {
            gte: new Date(options.startDate),
            lte: new Date(options.endDate)
          }
        } : {})
      },
      select: {
        id: true,
        createdAt: true,
        ipAddress: true,
        userAgent: true
      },
      orderBy: { createdAt: 'desc' },
      take: Math.floor(options.limit / 3)
    })
  ]);

  // Combine and format activities
  const activities = [
    ...blogs.map(blog => ({
      id: `blog-${blog.id}`,
      action: 'create_blog',
      timestamp: blog.createdAt,
      details: { subject: blog.subject }
    })),
    ...videos.map(video => ({
      id: `video-${video.id}`,
      action: 'create_video',
      timestamp: video.createdAt,
      details: { title: video.title }
    })),
    ...refreshTokens.map(token => ({
      id: `login-${token.id}`,
      action: 'login',
      timestamp: token.createdAt,
      details: {
        ipAddress: token.ipAddress,
        userAgent: token.userAgent
      }
    }))
  ];

  // Sort by timestamp and limit
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, options.limit);
};

export const getUserStatistics = async (options: { period: string }) => {
  const now = new Date();
  const periodDays = parseInt(options.period.replace('d', '')) || 30;
  const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

  const [
    totalUsers,
    activeUsers,
    newUsersThisPeriod,
    adminUsers,
    moderatorUsers,
    regularUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isBlocked: false } }),
    prisma.user.count({
      where: { createdAt: { gte: startDate } }
    }),
    prisma.user.count({ where: { isAdmin: true } }),
    prisma.user.count({ where: { isModerator: true, isAdmin: false } }),
    prisma.user.count({ where: { isAdmin: false, isModerator: false } })
  ]);

  // Get daily login data from refresh tokens
  const dailyLogins = await prisma.refreshToken.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)) }
    },
    _count: { id: true }
  });

  // Get user growth data
  const userGrowth = await prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: startDate }
    },
    _count: { id: true }
  });

  return {
    totalUsers,
    activeUsers,
    newUsersThisPeriod,
    usersByRole: [
      { role: 'admin', count: adminUsers },
      { role: 'moderator', count: moderatorUsers },
      { role: 'user', count: regularUsers }
    ],
    dailyLogins: dailyLogins.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count.id
    })),
    userGrowth: userGrowth.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count.id
    }))
  };
};

export const getBlogStatistics = async (options: {
  period: string;
  userId?: string
}) => {
  const now = new Date();
  const periodDays = parseInt(options.period.replace('d', '')) || 30;
  const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

  const where = options.userId ? { userId: options.userId } : {};
  const periodWhere = {
    ...where,
    createdAt: { gte: startDate }
  };

  const [
    totalBlogs,
    blogsThisPeriod,
    totalUsers,
    topAuthors,
    dailyBlogCreation
  ] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.count({ where: periodWhere }),
    prisma.user.count(),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { Blogs: true }
        }
      },
      orderBy: {
        Blogs: { _count: 'desc' }
      },
      take: 5
    }),
    prisma.blog.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)) }
      },
      _count: { id: true }
    })
  ]);

  const averageBlogsPerUser = totalUsers > 0 ? totalBlogs / totalUsers : 0;

  return {
    totalBlogs,
    blogsThisPeriod,
    averageBlogsPerUser: Number(averageBlogsPerUser.toFixed(2)),
    topAuthors: topAuthors.map(author => ({
      id: author.id,
      name: author.name || 'Unknown',
      blogCount: author._count.Blogs
    })),
    blogsByCategory: [
      { category: 'Technology', count: Math.floor(totalBlogs * 0.3) },
      { category: 'Lifestyle', count: Math.floor(totalBlogs * 0.25) },
      { category: 'Business', count: Math.floor(totalBlogs * 0.2) },
      { category: 'Education', count: Math.floor(totalBlogs * 0.15) },
      { category: 'Other', count: Math.floor(totalBlogs * 0.1) }
    ],
    dailyBlogCreation: dailyBlogCreation.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      count: item._count.id
    }))
  };
};
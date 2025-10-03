import prisma from "@src/utils/client";

export const createBlog = async (data: { subject: string; content: string; userId: string; videoId?: number; visible?: number }) => {
  return await prisma.blog.create({
    data,
  });
};

export const getBlogById = async (id: number) => {
  return await prisma.blog.findUnique({
    where: { id },
    include: { user: false, video: true },
  });
};

export const getBlogBySlug = async (slug: string) => {
  // Parse slug to extract title and date components
  const datePart = slug.slice(-10); // Last 10 characters (YYYY-MM-DD)
  const titlePart = slug.slice(0, -11); // Title part without date and hyphen

  // Convert slug title back to searchable format
  const titleKeywords = titlePart.replace(/-/g, ' ').toLowerCase();

  // Parse date for range search (same day)
  const searchDate = new Date(datePart);
  const nextDay = new Date(searchDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Find blog by matching title keywords and date range
  const blogs = await prisma.blog.findMany({
    where: {
      AND: [
        {
          subject: {
            contains: titleKeywords.split(' ')[0] // Use first keyword for broad matching
          }
        },
        {
          createdAt: {
            gte: searchDate,
            lt: nextDay
          }
        },
        {
          visible: 1 // Only visible blogs
        }
      ]
    },
    include: { user: false, video: true },
    orderBy: { createdAt: 'desc' }
  });

  // If we have multiple results, try to find the best match
  if (blogs.length > 0) {
    // Create slug for each blog and find exact match
    for (const blog of blogs) {
      const blogSlug = createSlugFromBlog(blog.subject, blog.createdAt);
      if (blogSlug === slug) {
        return blog;
      }
    }
    // If no exact match, return the first one (most recent)
    return blogs[0];
  }

  return null;
};

// Helper function to create slug from blog data (should match client-side logic)
const createSlugFromBlog = (title: string, createdAt: Date) => {
  const cleanTitle = title
    .replace(/[#*`_~\[\]()]/g, '') // Remove markdown
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 60); // Limit length

  // Format date as YYYY-MM-DD
  const date = createdAt.toISOString().split('T')[0];

  return `${cleanTitle}-${date}`;
};

// Interfaces for pagination and sorting
interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'subject' | 'id';
  sortOrder?: 'asc' | 'desc';
  visible?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getBlogs = async () => {
  return await prisma.blog.findMany({
    include: { user: false, video: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getBlogsWithPagination = async (options: PaginationOptions = {}): Promise<PaginatedResponse<any>> => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    visible
  } = options;

  // Validate pagination parameters
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
  const skip = (validatedPage - 1) * validatedLimit;

  // Validate sort parameters
  const validSortFields = ['createdAt', 'updatedAt', 'subject', 'id'];
  const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const validatedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

  // Build where clause
  const whereClause: any = {};
  if (visible !== undefined) {
    whereClause.visible = visible;
  }

  // Get total count for pagination metadata
  const total = await prisma.blog.count({
    where: whereClause,
  });

  // Get paginated data
  const data = await prisma.blog.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          // Exclude sensitive data
        }
      },
      video: true
    },
    orderBy: { [validatedSortBy]: validatedSortOrder },
    skip,
    take: validatedLimit,
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / validatedLimit);
  const hasNextPage = validatedPage < totalPages;
  const hasPrevPage = validatedPage > 1;

  return {
    data,
    meta: {
      total,
      page: validatedPage,
      limit: validatedLimit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

export const updateBlog = async (id: number, data: { subject?: string; content?: string; visible?: number }) => {
  return await prisma.blog.update({
    where: { id },
    data,
  });
};

export const deleteBlog = async (id: number) => {
  return await prisma.blog.delete({
    where: { id },
  });
};

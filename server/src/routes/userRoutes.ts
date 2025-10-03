import express from "express";
import {
    createUserController,
    getUserController,
    getAllUsersController,
    updateUserController,
    deleteUserController,
    getUserStatisticsController,
    getBlogStatisticsController,
    toggleUserStatusController,
    getUserProfileController,
    getUserActivityController
} from "@src/controllers/userController";
import { authenticateJWT } from "@src/middlewares/authMiddleware";

const router = express.Router();

// Middleware to ensure only admins can access user management routes
const adminOnly = (req: any, res: any, next: any) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }
    next();
};

// Apply auth middleware to protected routes
router.use(authenticateJWT);

// User profile routes (Authenticated users only) - MUST come before /:id routes
router.get("/profile", getUserProfileController);
router.get("/activity", getUserActivityController);

// User statistics (Admin only) - MUST come before /:id routes
router.get("/statistics/users", adminOnly, getUserStatisticsController);
router.get("/statistics/blogs", adminOnly, getBlogStatisticsController);

// User CRUD operations (Admin only) - Parameterized routes come last
router.post("/", adminOnly, createUserController);
router.get("/", adminOnly, getAllUsersController);
router.get("/:id", adminOnly, getUserController);
router.put("/:id", adminOnly, updateUserController);
router.delete("/:id", adminOnly, deleteUserController);
router.patch("/:id/toggle-status", adminOnly, toggleUserStatusController);

export default router;
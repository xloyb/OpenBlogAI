import express from "express";
import {
    createUserController,
    getUserController,
    getAllUsersController,
    updateUserController,
    deleteUserController,
    getUserStatisticsController,
    getBlogStatisticsController,
    toggleUserStatusController
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

// Apply auth middleware to all routes
router.use(authenticateJWT);

// User CRUD operations (Admin only)
router.post("/", adminOnly, createUserController);
router.get("/", adminOnly, getAllUsersController);
router.get("/:id", adminOnly, getUserController);
router.put("/:id", adminOnly, updateUserController);
router.delete("/:id", adminOnly, deleteUserController);
router.patch("/:id/toggle-status", adminOnly, toggleUserStatusController);

// User statistics
router.get("/statistics/users", adminOnly, getUserStatisticsController);
router.get("/statistics/blogs", adminOnly, getBlogStatisticsController);

export default router;
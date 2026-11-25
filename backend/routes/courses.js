
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

const courseService = require("../services/courseService");

// Barcha faol kurslarni ko'rish
router.get("/", async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses({
      isActive: true
    });

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    next(error);
  }
});

// Admin barcha kurslarni ko'radi
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courses = await courseService.getAllCourses();

      res.json({
        success: true,
        courses
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin yangi kurs qo'shadi
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { title, level, description } = req.body;

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof level !== "string" ||
        !level.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Course title and level are required"
        });
      }

      if (title.trim().length > 200) {
        return res.status(400).json({
          success: false,
          message: "Course title cannot exceed 200 characters"
        });
      }

      if (level.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: "Course level cannot exceed 50 characters"
        });
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Description must be a string"
        });
      }

      const course = await courseService.createCourse({
        title,
        level,
        description: description || "",
        isActive: false
      });

      res.status(201).json({
        success: true,
        course
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin kurs ma'lumotlarini yangilaydi
router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.id);
      const { title, level, description } = req.body;

      if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      if (
        title !== undefined &&
        (typeof title !== "string" ||
          !title.trim() ||
          title.trim().length > 200)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid course title"
        });
      }

      if (
        level !== undefined &&
        (typeof level !== "string" ||
          !level.trim() ||
          level.trim().length > 50)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid course level"
        });
      }

      if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Description must be a string"
        });
      }

      const updateData = {};

      if (title !== undefined) updateData.title = title;
      if (level !== undefined) updateData.level = level;

      // null yuborilsa, eski description saqlanadi
      if (description !== undefined && description !== null) {
        updateData.description = description;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No course fields provided"
        });
      }

      const course = await courseService.updateCourse(
        courseId,
        updateData
      );

      res.json({
        success: true,
        course
      });
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      next(error);
    }
  }
);

// Admin kursni faollashtiradi yoki faolsizlantiradi
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.id);
      const { isActive } = req.body;

      if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false"
        });
      }

      const course = await courseService.updateCourse(
        courseId,
        { isActive }
      );

      res.json({
        success: true,
        course
      });
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      next(error);
    }
  }
);

// Admin kursni o'chiradi
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const courseId = Number(req.params.id);

      if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID"
        });
      }

      await courseService.deleteCourse(courseId);

      res.json({
        success: true,
        message: "Course deleted successfully"
      });
    } catch (error) {
      if (error.message === "Course not found") {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      next(error);
    }
  }
);

module.exports = router;

import express from 'express'
import { buyCourse, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from '../controllers/course.controller.js';
import { purchases } from '../controllers/user.controller.js';
import userMiddleware from '../middleware/user.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

router.post("/course/create",adminMiddleware, createCourse);
router.put("/update-course/:courseId",adminMiddleware,updateCourse);
router.delete("/course/:courseId",adminMiddleware,deleteCourse);
router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)
router.post("/buy/:courseId",userMiddleware,buyCourse);
router.get("/purchases",userMiddleware,purchases)

export default router;
import express from "express";
import userAuth from "../middlewares/authmiddleware.js";
import { createJob, deleteJob, getAllJobs, jobStats, updateJobControllers } from "../controllers/jobController.js";

const router = express.Router();

router.post('/create-job', userAuth, createJob);
router.get('/get-jobs', userAuth, getAllJobs);
router.patch('/update-job/:id', userAuth, updateJobControllers);
router.delete("/delete-job/:id", userAuth, deleteJob);

router.get("/job-stats", userAuth, jobStats);

export default router
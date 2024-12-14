import moment from "moment";
import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";

export const createJob = async (req,res,next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        return next('Please provide all fields');
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({ job });
};

export const getAllJobs = async (req, res, next) => {
   
    const { status,workType,search ,sort} = req.query;
    
    //cndtions for searching
    const queryObject = {
        createdBy : req.user.userId,
    }
    if (status && status !== 'all') {
        queryObject.status = status;
    }
    if (workType && workType !== 'all') {
        queryObject.workType = workType;
    }
    if (search) {
        queryObject.position = {$regex: search,$options:'i'}
    }

    let queryResult = jobsModel.find(queryObject);

    //sort
    if (sort === "latest") {
        queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "oldest") {
        queryResult = queryResult.sort("createdAt");
    }
    if (sort === "a-z") {
      queryResult = queryResult.sort("position");
    }
    if (sort === "z-a") {
      queryResult = queryResult.sort("-position");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) + limit;
    
    queryResult = queryResult.skip(skip).limit(limit);
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit)

    const jobs = await queryResult;
    // console.log(jobs);

    // const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage,
    });
};

export const updateJobControllers = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;
    //validate
    if (!company || !position) {
        return next('Please provide all fields');
    }
    const job = await jobsModel.findOne({ _id: id });
    if (!job) {
        return next(`no jobs found with this id ${id}`);
    }
    if (req.user.userId !== job.createdBy.toString()) {
        return next('You are not allowed to update this job')
    }
    const updateJob = await jobsModel.findByIdAndUpdate({ _id: id }, req.body,
        {
            new: true,
            runValidators: true
        })
    res.status(200).json({ updateJob });
};

export const deleteJob = async (req, res, next) => {
    const { id } = req.params;
    const job = await jobsModel.findOne({ _id: id })
    if (!job) {
        return next(`No job found with tis id ${id}`);
    }
    if (req.user.userId !== job.createdBy.toString()) {
        return next('Your Not Authorized to delete this job');
    };
    await job.deleteOne();
    res.status(200).json({message:"Success, Job deleted"})
};

//filters
export const jobStats = async (req, res, next) => {
    const stats = await jobsModel.aggregate([
        //search by user jobs
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    //default stats
    const defaultstats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,
    };

    //monthly applications
    let monthlyApplications = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: '$createdAt' },
                    
                },
                count: {
                    $sum: 1,
                },
            }
        }
]);

    monthlyApplications = monthlyApplications.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return { date, count }
    }).reverse();
    res.status(200).json({totalJobs:stats.length, stats,monthlyApplications });
}
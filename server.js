//imports
//API documentation
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// const express = require('express'); normal export
import express from 'express';
import 'express-async-errors'
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';
//files imports
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobsRoutes.js';
//secuty packages
import helmet from 'helmet';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';


//dotenv
dotenv.config()

//mongodb connection
connectDB();

//swagger api config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node ExpressJs Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:5033",
      },
    ],
    },
    apis:['./routes/*.js'],
};

const spec = swaggerJSDoc(options)

//rest objects
const app = express();

//middlewares
app.use(helmet());
app.use(xss());
app.use(ExpressMongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/user", userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validation middleware
app.use(errorMiddleware)

//PORT 
const PORT = process.env.PORT || 4044;
//listen
app.listen(PORT, () => {
    // console.log(`Server started at http://localhost:${PORT}/`.america)
})
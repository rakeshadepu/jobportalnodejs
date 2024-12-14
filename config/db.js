import colors from "colors";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`Connected to database ${mongoose.connection.host}`.blue);
  } catch (error) {
    // console.log(`Mongodb error: ${error.message}`.red);
  }
};

export default connectDB;
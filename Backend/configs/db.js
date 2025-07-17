const mongoose = require("mongoose");

const connectDB= async()=>{
    try{
          await mongoose.connect(process.env.MONGOOSE_KEY) 
          console.log("Connected to db")
    }catch(err){
      console.log("failed to Connect db");
    }
}

module.exports = connectDB;
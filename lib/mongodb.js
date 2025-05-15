import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
// console.log("🔍 MONGODB_URI is:", process.env.MONGODB_URI);
if(!MONGODB_URI){
    throw new Error("Please difine the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}

async function dbConnect(){
  // console.log("db connect started");
  
    if(cached.conn){
        return cached.conn;
    }
    const opts = {
        bufferCommands: false,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,    
    }
    if(!cached.promise){
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
    });

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
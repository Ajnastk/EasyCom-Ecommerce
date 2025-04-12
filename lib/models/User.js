import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true,
    },
    email:{
        type:String,
        required :true,
        unique : true,
    },
    password:{
        type:String,
        required : true,
    },
    role:{
        type : String,
        enum :['user','admin'],
        default : 'user'
    }
},{
    timestamps : true
});

module.exports = mongoose.model('User',UserSchema);
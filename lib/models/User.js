import mongoose from "mongoose";

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

// This prevents redefining the model during hot reloads in dev
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// ✅ Use ESModule export
export default User;
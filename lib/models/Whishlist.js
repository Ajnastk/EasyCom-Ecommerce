import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    products :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }]
},{timestamps: true});

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist",WishlistSchema);
export default Wishlist;
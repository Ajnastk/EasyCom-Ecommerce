import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name :{
        type :String,
        required : true,
        trim : true,
    },
    description :{
        type : String,
        required :true,
    },
    brand :{
        type : String,
        required: true
    },
    price :{
        type : String,
        required : true,
    },
    image :{
        type:String,
        required :true,
    },
    category :{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Category',
    },
    quantity :{
        type : Number,
        required :true,
    },
    color :{
        type :String,
        required : true,
    },
},{
    timestamps :true
});

const Product = mongoose.models.Product || mongoose.model('Product',ProductSchema)

// ✅ Use ESModule export
export default Product;
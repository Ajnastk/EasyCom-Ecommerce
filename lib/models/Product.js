import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name :{
        type :String,
        required : true,
        unique:false
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
        type : Number,
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
    stock :{
        type : Number,
        required :true,
    },
    color :{
        type :String,
        required : true,
    },
    NewArrival:{
        type:Boolean,
        require:true,
        // default :false
    },
    TopProduct:{
        type:Boolean,
        require:true,
    }
},{
    timestamps :true
});

const Product = mongoose.models.Product || mongoose.model('Product',ProductSchema)

// ✅ Use ESModule export
export default Product;
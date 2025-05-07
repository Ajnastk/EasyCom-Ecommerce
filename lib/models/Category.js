import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    description : {
        type : String,
        required :false,
    },
    slug: {
        type: String,
        required: true,
      },
    image :{
        type : String,
        required : false,
    }
},{
    timestamps : true
});

const Category = mongoose.models.Category || mongoose.model('Category',CategorySchema)

// ✅ Use ESModule export
export default Category;
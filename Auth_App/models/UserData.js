const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,

    },

    email:{
        type:String,
        reuired:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Admin","Student","Visitor"]
    },
    token:{

    }
})

module.exports=mongoose.model("User",userSchema);
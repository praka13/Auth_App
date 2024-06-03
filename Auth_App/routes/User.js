
const express=require("express");
const router=express.Router();

const User=require("../models/UserData");


const {login,signup}=require("../controllers/auth");
const{auth,isStudent,isAdmin}=require("../middlewares/auth");


router.post("/login",login);
router.post("/signup",signup);


router.post("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for Test"
    })
})

//Protected route
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for students"
    })
})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route for admin"
    })
})

router.get("/getEmail",auth,async (req,res)=>{
    try{
        const id=req.user.id;
        console.log(id);
        const user=await User.findById(id);

        res.status(200).json({
            success:true,
            user:user,
            
            message:"Email route Entered"

        })

    }

    catch(err){


        res.status(500).json({
            success:false,
    
        })

        
    }


});



module.exports=router;


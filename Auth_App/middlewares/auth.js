// auth,isStudent,isAdmin
const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{

    try{

        console.log("body token",req.body.token);
        console.log("cookie token",req.cookies.token);
        console.log("header token",req.header("Authorization").replace("Bearer "),"");
        //extract jwt token
        const token=req.cookies.token;


        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token Missing",
            });
        }

        //verify the token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);

            req.user=decode;
            //console.log(req.user);

        }
        catch(err){

            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })

        }

        next();


    }

    catch(err){

        return res.status(401).json({
            success:false,
            message:"Some Error Occurred"
        })

    }

}

exports.isStudent=(req,res,next)=>{
    try{

        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"Not a Student"
            })

        }

        next();

    }

    catch(err){

        return res.status(500).json({
            success:false,
            message:"User Role is not matching"
        })

    }
}


exports.isAdmin=(req,res,next)=>{
    try{

        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"Not a Admin"
            })

        }

        next();

    }

    catch(err){

        return res.status(500).json({
            success:false,
            message:"User Role is not matching"
        })

    }
}
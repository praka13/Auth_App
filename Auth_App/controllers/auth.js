const bcrypt=require('bcrypt');
const User=require("../models/UserData");
const jwt=require("jsonwebtoken");
require("dotenv").config();



//signup route handler

exports.signup=async(req,res)=>{
   
    try{
        //get data
        const{name,email,password,role}=req.body;

        //check if user already exist

        const existingUser=await User.findOne({email});
        

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            });
        }

        else{
            let hashedPassword;

            try{
                hashedPassword=await bcrypt.hash(password,10);
    
            }
            catch(err){
                return res.status(500).json({
                    success:false,
                    message:"Error in Hashing Password"
                })
    
            }
    
            //create entry for User
    
            const oUser=await User.create({
                name,email,password:hashedPassword,role
            }) 
    
            return res.status(200).json({
                success:true,
                message:"User Created Successfully"
            })
    
        }

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered,please try again later"
        })

    }
}


exports.login=async(req,res)=>{
    try{
        //fetch data
        const{email,password}=req.body;
        if(!email ||!password){
            return res.status(400).json({
                success:false,
                message:"Please enter all details"
            })

        }

        const user=await User.findOne({email});
        if(!user){
            res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        const payload={
            email:user.email,
            id:user._id,
            role:user.role,

        }

        //verify password
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"10h"});

           //user.toObject();

            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+30000*20),
                httpOnly:true,

            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully"

            });
            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:"User logged in successfully"

            // });


        } 

        else{
            return res.status(403).json({
                succes:false,
                message:"password incorrect"
            })
        }

    }

    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Some error occured"
        })

    }
}


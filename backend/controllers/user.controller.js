import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken'
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";


export const signup = async(req,res) => {

    const {firstName,lastName,email,password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    try {

        const exist = await User.findOne({email : email});

        if(exist){
            return res.status(500).json({message : "User already exists"})
        }

       

        const newUser = new User({firstName,lastName,email,password:hashPassword});

        await newUser.save();

        res.status(200).json({message: "User created successfully",newUser})


        
    } catch (error) {
        console.log(error);
        
    }
    
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const token = jwt.sign({
        id : user._id,
    }, config.JWT_PASSWORD,
  { expiresIn: "1d" })


    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, //  can't be accsed via js directly
      secure: process.env.NODE_ENV === "production", // true for https only
      sameSite: "Strict", // CSRF attacks
    };

    res.cookie("jwt",token);

    
   
    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
    console.log("error in login", error);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};


export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchased = await Purchase.find({ userId });

    let purchasedCourseId = [];

    for (let i = 0; i < purchased.length; i++) {
      purchasedCourseId.push(purchased[i].courseId);
    }
    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });

    res.status(200).json({ purchased, courseData });
  } catch (error) {
    console.log("Error in purchase", error);
    return res.status(500).json({ errors: "Error in purchases" });
    
  }
};
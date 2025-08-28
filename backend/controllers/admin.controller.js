import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken'
import config from "../config.js";
import { Admin } from "../models/admin.model.js";

export const signup = async(req,res) => {

    const {firstName,lastName,email,password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    try {

        const exist = await Admin.findOne({email : email});

        if(exist){
            return res.status(500).json({message : "Admin already exists"})
        }

       

        const newUser = new Admin({firstName,lastName,email,password:hashPassword});

        await newUser.save();

        res.status(200).json({message: "User created successfully",newUser})


        
    } catch (error) {
        console.log(error);
        
    }
    
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!admin || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const token = jwt.sign({
        id : admin._id,
    }, config.JWT_ADMIN_PASSWORD,
  { expiresIn: "1d" })


    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, //  can't be accsed via js directly
      secure: process.env.NODE_ENV === "production", // true for https only
      sameSite: "Strict", // CSRF attacks
    };

    res.cookie("jwt",token);

    
   
    res.status(201).json({ message: "Login successful", admin, token });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ errors: "Error in login" });
    
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
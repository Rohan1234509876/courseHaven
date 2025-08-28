import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

export const createCourse =async (req,res) => {
    const adminId = req.adminId;
    const {title,description,price} = req.body;
    try {
        if(!title || !description || !price ){
    return res.status(400).json({message:"Please fill all the fields"});
}


        const {image} = req.files;

        if(!req.files || Object.keys(req.files).length === 0){
            return res.send({message:"Please upload a file"})
        }

        const allowedFormat = ["image/png","image/jpeg","image/jpg"];

        if(!allowedFormat.includes(image.mimetype)){
            return res.send({message:"Please upload a valid file"})
        }

        const result = await cloudinary.uploader.upload(image.tempFilePath);

        
        

        const courseData = {
            title,
            description,
            price,
            image : {
                public_id:result.public_id,
                url:result.url
            },
            creatorId : adminId
        }
            
        

        const course = await Course.create(courseData);
        return res.json({
            message:"Course Created",
            course
        });
    } catch (error) {
        console.log(error);
        
    }
}



export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    let updatedData = { title, description, price, creatorId: adminId };

    // check if image is provided
    if (req.files && req.files.imageUrl) {
      const file = req.files.imageUrl;

      // upload to cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "courses",
      });

      updatedData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const result = await Course.updateOne(
      { _id: courseId },
      { $set: updatedData }
    );

    return res.json({
      message: "Course Updated",
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};


export const deleteCourse = async(req,res) => {
    const adminId = req.adminId;
    const {courseId} = req.params;
    try {

        const result = await Course.findOneAndDelete({
            _id:courseId,
            creatorId : adminId
        })
        if(!result){
            return res.status(404).json({
                message:"Course Not Found"
            })

        }
        return res.json({
            message:"Course Deleted",
            
        })
    } catch (error) {
        console.log(error);
        
        
    } 
}

export const getCourses = async(req,res) => {
    try {
        const courses = await Course.find();
        return res.json({
            message:"Courses Fetched",
            courses
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting course details" });
    console.log("Error in course details", error);
  }
};

import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);

export const buyCourse = async (req,res) => {
    
  const {userId} = req;
  const {courseId} = req.params;
  try {

    const course = await Course.findById(courseId);

    const existing = await Purchase.findOne({userId, courseId});
    if(existing){
      return res.status(400).json({message : "You have already purchased this course"});
    }


   // stripe payment code goes here!!
    const amount = course.price*100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });


    
    console.log("PaymentIntent created:", paymentIntent.client_secret);

    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });

    
  } catch (error) {
    console.log(error)
    return res.status(500).json({errors : "Error in buyCourse"});
    
    
  }

}    
    



       
        
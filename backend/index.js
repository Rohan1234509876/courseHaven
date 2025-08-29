import express from 'express'
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from "cors";
import courseRoutes from './routes/course.route.js'
import userRoutes from './routes/user.route.js'
import orderRoutes from './routes/order.route.js'
import adminRoutes from './routes/admin.route.js'
import fileUpload from 'express-fileupload'
dotenv.config()
const app = express()

app.use(express.json())
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const port = process.env.PORT || 3000

const URI = process.env.MONGO_URI

try{
    await mongoose.connect(URI);
    console.log('Connected to MongoDB')

} catch(error){
    console.log(error)


}

app.use("/api/v1",courseRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/admin",adminRoutes);
app.use("/api/v1/order",orderRoutes);
cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
    });


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

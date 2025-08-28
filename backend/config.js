import dotenv from "dotenv";
dotenv.config(); // Make sure this line is here at the top



const JWT_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export default {
  JWT_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,

};

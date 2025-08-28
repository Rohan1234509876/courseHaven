import jwt from 'jsonwebtoken';
import config from '../config.js';
const adminMiddleware = async (req,res,next) => {
    
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.json({error: 'No token provided'});
    }

    const token = authHeader.split(' ')[1];

    try {
         const decoded = jwt.verify(token,config.JWT_ADMIN_PASSWORD);
         req.adminId = decoded.id;

         next();
        
    } catch (error) {
        return res.status(401).json({error: 'Invalid token'});                              

        console.log(error);
        
    }

}

export default adminMiddleware;
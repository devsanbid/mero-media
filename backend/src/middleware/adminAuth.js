import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

const adminAuth = async (req, res, next) => {
  try {
    const authToken = req.header("auth-token");
    if (!authToken) {
      return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    const data = await jwt.verify(authToken, process.env.JWT_SECRET);
    
    // Fetch user details to check role
    const user = await User.findByPk(data.id, {
      attributes: ['id', 'role']
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};

export { adminAuth };
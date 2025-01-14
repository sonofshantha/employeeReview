import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).send('Access denied');
    next();
  };

 export  const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Access denied');
    try {
      const decoded = jwt.verify(token, 'secretKey');
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(400).send('Invalid token');
    }
  };
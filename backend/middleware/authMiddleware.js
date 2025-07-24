import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({success:false, message: 'Unauthorized Token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({success:false, message: 'Invalid token' });
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '1d',
  });
};

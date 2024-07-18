import { jwtService } from '../services/jwt.service.js';

export const errorMiddleware = (error, req, res, next) => {
  if (error) {
    res.statusCode = 500;
    res.send({
      message: 'Server error',
    });
  }
  next()
};

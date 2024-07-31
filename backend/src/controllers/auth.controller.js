import { User } from '../models/user.js';
import bcrypt from 'bcrypt'
import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';
import { ApiError } from '../exeptions/api.error.js';

function validateEmail(value) {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }
}

function validatePassword(value) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }
}

const register = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password) {
    throw ApiError.BadRequest('Bad request', errors);
  }

  const hashedPass = await bcrypt.hash(password, 10);
  await userService.register(email, hashedPass);

  res.send({ message: 'OK' });
};

const activate = async (req, res) => {
  const { activationToken } = req.params
  const user = await User.findOne({ where: { activationToken } })
  if (!user) {
    res.sendStatus(404)
    return
  }
  user.activationToken = null
  user.save()
  res.send(user)
}

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    throw ApiError.BadRequest('No such user');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.BadRequest('Wrong password');
  }
  generateTokens(res, user)
  
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  const user = jwtService.verifyRefresh(refreshToken)
  if (!user) {
    throw ApiError.Unauthorized()
  }
  generateTokens(res, user)
};

const generateTokens = (res, user) => {
  const normalizedUser = userService.normalize(user);
  const accessToken = jwtService.sign(normalizedUser);
  const refreshToken = jwtService.signRefresh(normalizedUser);
  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    HttpOnly: true
  })

  res.send({
    user: normalizedUser,
    accessToken,
  });
}

export const authController = {
  register,
  activate,
  login,
  refresh
};

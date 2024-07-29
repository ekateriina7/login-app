import { User } from '../models/user.js';
import { emailService } from '../services/email.service.js';
import { v4 as uuidv4 } from 'uuid';
import { userService } from '../services/user.service.js';
import { jwtService } from '../services/jwt.service.js';

const register = async (req, res) => {
  const { email, password } = req.body;
  await userService.register(email, password);
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
  const user = await userService.findByEmail(email)
  if (!user || user.password !== password) {
    res.sendStatus(401)
    return
  }
const normalizedUser = userService.normalize(user)
  const accessToken = jwtService.sign(normalizedUser)
  res.send({
    user: normalizedUser,
    accessToken
  })
}

export const authController = {
  register,
  activate,
  login
};

import express from 'express'
import { authController } from '../controllers/auth.controller.js'

export const router = new express.Router()
router.post('/registration', authController.register)
router.get('/activation/:activationToken', authController.activate)
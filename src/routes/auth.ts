import express, { Request, Response, NextFunction } from 'express'
import { AuthController } from '../controllers/AuthControllers'
import { UserService } from '../services/userService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'

import registorValidator from '../validators/registor-validator'
import { TokenService } from '../services/TokenService'

// Initialize router
const router = express.Router()

// Get User repository and create services/controllers
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const tokenService = new TokenService()
const authController = new AuthController(userService, logger, tokenService)

// Route with validation
router.post(
    '/register',
    registorValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
)
export default router

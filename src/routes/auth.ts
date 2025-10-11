import express, { Request, Response, NextFunction } from 'express'
import { AuthController } from '../controllers/AuthControllers'
import { UserService } from '../services/userService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'

import registorValidator from '../validators/registor-validator'
import { TokenService } from '../services/TokenService'
import { RefreshToken } from '../entity/refreshToken'
import loginValidator from '../validators/login-validator'
import { CredentialService } from '../services/CredentialService'
import authenticate from '../middlewares/authenticate'
import { AuthRequest } from '../types'
import validateRefreshToken from '../middlewares/validateRefreshToken'

// Initialize router
const router = express.Router()

// Get User repository and create services/controllers
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

const tokenService = new TokenService(refreshTokenRepository)
const credentialService = new CredentialService()
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
)

// Route with validation
router.post(
    '/register',
    registorValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
)

router.post(
    '/login',
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
)

router.get('/self', authenticate, (req: Request, res: Response) =>
    authController.self(req as AuthRequest, res),
)

router.post(
    '/refresh',
    validateRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequest, res, next),
)

export default router

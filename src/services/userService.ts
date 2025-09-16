import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types'
import createHttpError from 'http-errors'
import { Roles } from '../constants'
import bcrypt from 'bcrypt'

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        })

        if (user) {
            const err = createHttpError(400, 'Email is already exists')
            throw err
        }

        // Hash the password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        try {
            const user = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            })
            return user
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to store data in Database',
            )
            throw error
        }
    }
}

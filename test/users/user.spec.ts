import { DataSource } from 'typeorm'
import app from '../../src/app'
import creatJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'
import { User } from '../../src/entity/User'

describe('GET /auth/self', () => {
    let jwks: ReturnType<typeof createJWKSMock>
    let connection: DataSource

    beforeAll(async () => {
        jwks = creatJWKSMock('http://localhost:5501')
        connection = await AppDataSource.initialize()
    })

    // eslint-disable-next-line @typescript-eslint/require-await
    afterEach(async () => {
        jwks.stop()
    })

    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return the 200 status code', async () => {
            const accessToken = jwks.token({ sub: '1', role: Roles.CUSTOMER })

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()
            expect(response.statusCode).toBe(200)
        })

        it('should return the user data', async () => {
            // Register user
            const userData = {
                firstName: 'Mayank',
                lastName: 'K',
                email: 'mayank@gmail.com',
                password: 'secret',
            }
            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            })

            // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            })
            // Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send()
            // Assert
            // check if user id matches with the registered user
            expect((response.body as Record<string, string>).id).toBe(data.id)
        })
    })
})

import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { truncateTables } from '../utils'

describe('POST /auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            //AAA
            // Arrrange
            const userData = {
                firstName: 'Mayank',
                lastName: 'k',
                email: 'mayank@gmail.com',
                password: 'secret',
            }
            // Act
            const resonse = await request(app)
                .post('/auth/register')
                .send(userData)
            // Assert
            expect(resonse.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            // Arrrange
            const userData = {
                firstName: 'Mayank',
                lastName: 'k',
                email: 'mayank@gmail.com',
                password: 'secret',
            }
            // Act
            const resonse = await request(app)
                .post('/auth/register')
                .send(userData)
            // Assert application/json utf-8
            expect(
                (resonse.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'))
        })

        it('should persist the user into the database', async () => {
            //   Arrange
            const userData = {
                firstName: 'Mayank',
                lastName: 'k',
                email: 'mayank@gmail.com',
                password: 'secret',
            }
            // Act
            await request(app).post('/auth/register').send(userData)
            // Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)
        })

        it('should return the id of the created user', async () => {
            //   Arrange
            const userData = {
                id: 22,
                firstName: 'Mayank',
                lastName: 'k',
                email: 'mayank@gmail.com',
                password: 'secret',
            }
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)
            // Assert
            expect(response.body).toHaveProperty('id')
            const Repository = connection.getRepository(User)
            const users = await Repository.find()
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            )
        })
    })

    describe('Fields are missing', () => {})
})

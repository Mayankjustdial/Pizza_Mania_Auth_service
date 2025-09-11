import request from 'supertest'
import app from '../../src/app'

describe('POST /auth/register', () => {
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
            // Assert
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
            const resonse = await request(app)
                .post('/auth/register')
                .send(userData)
            // Assert
            expect(
                (resonse.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'))
        })
    })

    describe('Fields are missing', () => {})
})

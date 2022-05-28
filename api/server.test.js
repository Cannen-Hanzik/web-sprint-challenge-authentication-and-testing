const request = require('supertest')
const server = require('./server')
const db =  require('../data/dbConfig')
const bcrypt = require('bcryptjs/dist/bcrypt')
// const jwtDecode = require('jwt-decode')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

// beforeEach(async() => {
//   await db.seed.run()
// })

afterAll(async () => {
  await db.destroy()
})

// Write your tests here
test('[0] sanity check', () => {
  expect(true).not.toBe(false)
})
// http://localhost:3300/api/auth/register
describe('server.js', () => {
  describe('[POST] /api/auth/register', () => {
    it('[1] posting to register creates a new user in database', async () => {
      await request(server).post('/api/auth/register')
            .send({ username: 'Jimmy', password: '12345' })
      const jimmy = await db('users')
                          .where('username', 'Jimmy')
                          .first()
      expect(jimmy).toMatchObject({ username: 'Jimmy' })
    }, 750)
    it('[2] saves user with bcrypted password', async () => {
      await request(server).post('/api/auth/register')
            .send({ username: 'jane', password: '12345' })
      const jane = await db('users')
                          .where('username', 'jane')
                          .first()
      expect(bcrypt.compareSync('12345', jane.password)).toBeTruthy()
    }, 750) 
    it('[3] responds with proper status on successful registration', async() => {
      const res = await request(server).post('/api/auth/register')
                        .send({ username: 'johnny', password: 'qwerty' })
      expect(res.status).toBe(201)
    }, 750)
  })
  describe('[GET] /api/jokes', () => {
    it('[4] requests without token bounce with proper status and message', async() => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    }, 750)
    it('[5] requests with invalid token bounced with appropriate message', async() => {
      const res = await request(server).get('/api/jokes').set('Authorization', 'someText')
      expect(res.body.message).toMatch(/token invalid/i)
    }, 750)
  })
  describe('[POST] /api/auth/login', () => {
    it('[6] correct status on valid credentials', async() =>{
      const res = await request(server)
                        .post('/api/auth/login')
                        .send({ username: 'bib', password: '1234' })
      expect(res.status).toBe(401)
    }, 750)
    it('[7] correct message on invalid login', async() => {
      let res = await request(server)
                      .post('/api/auth/login')
                      .send({ username: 'blimp', password: '1234'})
      expect(res.body.message).toMatch(/invalid credentials/i)
    }, 750)
  })
})

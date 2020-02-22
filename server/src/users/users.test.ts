import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as supertest from 'supertest'

import { UserEntity } from './user.entity'
import { UserModule } from './user.module'

describe('Users', () => {
  let app: INestApplication
  let repository: Repository<UserEntity>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'docker',
          database: 'iot-app',
          entities: ['./**/*.entity.ts'],
          synchronize: false
        })
      ]
    }).compile()

    app = module.createNestApplication()
    repository = module.get('UserEntityRepository')
    await app.init()
  })

  afterAll(async () => {
    await repository.query(`DELETE FROM users;`)
    await app.close()
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'test',
        email: 'test@test.com',
        password: 'test',
        role: 'admin'
      }

      const { body } = await supertest
        .agent(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201)

      expect(body.user).toBeDefined()
      expect(body.user.username).toEqual('test')
      expect(body.user.email).toEqual('test@test.com')
      expect(body.user.token).toEqual(expect.any(String))
      expect(body.user.role).toEqual('admin')
    })
  })

  describe('POST users/login', () => {
    it('returns 201', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'test'
      }

      const { body } = await supertest
        .agent(app.getHttpServer())
        .post('/users/login')
        .send(credentials)
        .expect(201)

      expect(body).toEqual({
        user: {
          email: 'test@test.com',
          token: expect.any(String),
          username: 'test',
          role: 'admin',
          avatar: null
        }
      })
    })
  })
})

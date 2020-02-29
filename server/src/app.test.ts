import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as supertest from 'supertest'

import { User } from './users/user.entity'
import { UserModule } from './users/user.module'
import { Group } from './groups/group.entity'
import { GroupModule } from './groups/group.module'

describe('App', () => {
  let app: INestApplication
  let usersRepository: Repository<User>
  let groupsRepository: Repository<Group>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        GroupModule,
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
    groupsRepository = module.get('GroupRepository')
    usersRepository = module.get('UserRepository')

    // Groups data
    const parentGroup = await groupsRepository.query(
      `INSERT INTO groups (name) VALUES ('parent') RETURNING *`
    )
    const subgroupsLevel1 = await groupsRepository.query(
      `INSERT INTO groups (name, parent_id) 
    VALUES ('child_1', $1), ('child_2', $1)
    RETURNING *`,
      [parentGroup.id]
    )
    const groupsIds = subgroupsLevel1.map(subgroup => subgroup.id)
    await groupsRepository.query(
      `INSERT INTO groups (name, parent_id) VALUES ('sub_1', $1), ('sub_2', $1)`,
      [groupsIds[0]]
    )

    // Users data
    await usersRepository.query(
      `INSERT INTO users (username, email, password, role, group_id) VALUES ('admin', 'admin@admin.com', 'test', 'admin', null), ('user', 'user@user.com', 'test', 'user', $1)`,
      [groupsIds[0]]
    )

    await app.init()
  })

  afterAll(async () => {
    await groupsRepository.query(`DELETE FROM groups;`)
    await usersRepository.query(`DELETE FROM users;`)
    await app.close()
  })

  describe('Users', () => {
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
        expect(body.user.groupId).toEqual(null)
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
            groupId: null,
            id: expect.any(String),
            username: 'test',
            role: 'admin',
            avatar: null
          }
        })
      })
    })
  })
})

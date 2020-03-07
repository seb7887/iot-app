import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as supertest from 'supertest'
import * as bcrypt from 'bcrypt'

import { User } from './users/user.entity'
import { UserModule } from './users/user.module'
import { Group } from './groups/group.entity'
import { GroupModule } from './groups/group.module'

const userLogin = async (
  credentials: Record<string, string>,
  app: INestApplication
) => {
  const { body } = await supertest
    .agent(app.getHttpServer())
    .post('/users/login')
    .send(credentials)
    .expect(201)

  return body.user.token
}

describe('App', () => {
  let app: INestApplication
  let usersRepository: Repository<User>
  let groupsRepository: Repository<Group>
  let groupsIds: string[]
  let token: string
  let id: string

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
    groupsIds = subgroupsLevel1.map(subgroup => subgroup.id)
    await groupsRepository.query(
      `INSERT INTO groups (name, parent_id) VALUES ('sub_1', $1), ('sub_2', $1)`,
      [groupsIds[0]]
    )

    // Users data
    const hash = bcrypt.hashSync('test', 10)
    await usersRepository.query(
      `INSERT INTO users (username, email, password, role, group_id) VALUES ('admin', 'admin@admin.com', $1, 'admin', null), ('user', 'user@user.com', $1, 'user', $2)`,
      [hash, groupsIds[0]]
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
        token = body.user.token

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

  describe('Groups', () => {
    describe('POST /groups', () => {
      it('should create a new group', async () => {
        const newGroup = {
          name: 'test',
          parentId: groupsIds[1]
        }

        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/groups')
          .set('Authorization', `Bearer ${token}`)
          .send(newGroup)
          .expect(201)
        id = body.group.id

        expect(body.group).toBeDefined()
        expect(body.group).toEqual({
          id: expect.any(String),
          ...newGroup
        })
      })
    })

    describe('GET /groups/:id', () => {
      it('should return group info', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .get(`/groups/${id}`)
          .expect(200)

        expect(body.group).toBeDefined()
        expect(body.group).toEqual({
          id,
          name: 'test',
          parentId: groupsIds[1]
        })
      })
    })

    describe('GET /groups', () => {
      it('should return all groups if user is admin', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .get('/groups?sortBy=id&pageSize=8&page=1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        expect(body.groups).toBeDefined()
        expect(body.groups).toHaveLength(6)
      })

      it('should return only group hierarchy if user is not admin', async () => {
        token = await userLogin(
          {
            email: 'user@user.com',
            password: 'test'
          },
          app
        )

        const { body } = await supertest
          .agent(app.getHttpServer())
          .get('/groups?sortBy=id&pageSize=8&page=1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        expect(body.groups).toBeDefined()
        expect(body.groups).toHaveLength(3)
      })
    })
  })
})

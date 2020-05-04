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
import { Device } from './devices/device.entity'
import { DeviceModule } from './devices/device.module'
import { Logs } from './logs/logs.entity'
import { LogsModule } from './logs/logs.module'
import { Timeseries } from './timeseries/timeseries.entity'
import { TimeseriesModule } from './timeseries/timeseries.module'

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
  let deviceRepository: Repository<Device>
  let logsRepository: Repository<Logs>
  let tsRepository: Repository<Timeseries>
  let groupsIds: string[]
  let token: string
  let id: string
  let resetToken: string
  let sampleDevices: Record<string, any>[]
  let deviceSerial: string
  let deviceSecret: string
  let sampleLogs: Record<string, any>[]

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        GroupModule,
        DeviceModule,
        LogsModule,
        TimeseriesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '',
          database: 'postgres',
          entities: ['./**/*.entity.ts'],
          synchronize: false
        })
      ]
    }).compile()

    app = module.createNestApplication()
    groupsRepository = module.get('GroupRepository')
    usersRepository = module.get('UserRepository')
    deviceRepository = module.get('DeviceRepository')
    logsRepository = module.get('LogsRepository')
    tsRepository = module.get('TimeseriesRepository')

    // Groups data
    try {
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
    } catch (err) {
      console.log(err)
    }

    // Users data
    try {
      const hash = bcrypt.hashSync('test', 10)
      await usersRepository.query(
        `INSERT INTO users (username, email, password, role, group_id) VALUES ('admin', 'admin@admin.com', $1, 'admin', null), ('user', 'user@user.com', $1, 'user', $2)`,
        [hash, groupsIds[0]]
      )
    } catch (err) {
      console.log(err)
    }

    // Device data
    try {
      sampleDevices = await deviceRepository.query(
        `
      INSERT INTO devices (group_id, serial, password, properties) VALUES 
        ($1, '3d605a75-f8b3-48da-b51c-6738bee4e050', 'test', $3),
        ($1, '3d605a75-f8b3-48da-b51c-6738bee4e051', 'test', $4), 
        ($1, '3d605a75-f8b3-48da-b51c-6738bee4e052', 'test', '{}'), 
        ($2, '3d605a75-f8b3-48da-b51c-6738bee4e053', 'test', '{}') RETURNING *
    `,
        [
          groupsIds[0],
          groupsIds[1],
          { sampleProp: 1234 },
          { anotherProp: 'test' }
        ]
      )
    } catch (err) {
      console.log(err)
    }

    try {
      sampleLogs = await logsRepository.query(
        `
        INSERT INTO logs (device_id, connected) VALUES ($1, true), ($1, false)
      `,
        [sampleDevices[1].id]
      )
    } catch (err) {
      console.log(err)
    }

    await app.init()
  })

  afterAll(async () => {
    await groupsRepository.query(`DELETE FROM groups;`)
    await usersRepository.query(`DELETE FROM users;`)
    await deviceRepository.query(`DELETE FROM devices;`)
    await logsRepository.query(`DELETE FROM logs;`)
    await tsRepository.query(`DELETE FROM timeseries;`)
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
      it('should login a user', async () => {
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
        id = body.user.id

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

    describe('POST users/validate-jwt', () => {
      it('should validate a JWT', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/users/validate-jwt')
          .send({ jwt: token })
          .expect(201)

        expect(body).toBeDefined()
        expect(body.isValid).toBeTruthy()
      })
    })

    describe('PUT users/:id', () => {
      it('should update a user', async () => {
        const newData = {
          email: 'test@test.com',
          username: 'changed',
          avatar: 'test_avatar'
        }

        const { body } = await supertest
          .agent(app.getHttpServer())
          .put(`/users/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(newData)
          .expect(200)

        expect(body).toBeDefined()
        expect(body.user).toEqual({
          email: newData.email,
          username: newData.username,
          avatar: newData.avatar,
          id,
          token: expect.any(String),
          role: 'admin',
          groupId: null
        })
      })
    })

    describe('POST users/reset-token', () => {
      it('should generate a new password reset token', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/users/reset-token')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: 'test@test.com' })
          .expect(201)

        expect(body).toBeDefined()
        expect(body).toMatchObject({
          resetToken: expect.any(String)
        })
        resetToken = body.resetToken
        const user = await usersRepository.query(
          `SELECT * FROM users WHERE email = 'test@test.com'`
        )
        id = user[0].id
        expect(user[0].reset_token).toEqual(resetToken)
      })
    })

    describe('POST users/reset-password/:id', () => {
      it('should reset user password', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post(`/users/reset-password/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            resetToken,
            newPassword: 'newPassword'
          })
          .expect(201)

        expect(body).toBeDefined()
        expect(body).toMatchObject({
          success: true
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

  describe('Devices', () => {
    describe('GET /devices', () => {
      it('should list only group devices if user is not admin', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .get('/devices?sortBy=id&pageSize=8&page=1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        expect(body.devices).toBeDefined()
        expect(body.devices).toHaveLength(3)
        expect(body.meta).toBeDefined()
        expect(body.meta.count).toEqual(3)
      })

      it('should list all devices if user is admin', async () => {
        token = await userLogin(
          {
            email: 'admin@admin.com',
            password: 'test'
          },
          app
        )

        const { body } = await supertest
          .agent(app.getHttpServer())
          .get('/devices?sortBy=id&pageSize=8&page=1')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        expect(body.devices).toBeDefined()
        expect(body.devices).toHaveLength(4)
        expect(body.meta).toBeDefined()
        expect(body.meta.count).toEqual(4)
      })
    })

    describe('GET /devices/:id', () => {
      it('should get a single device', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .get(`/devices/${sampleDevices[0].id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        expect(body.device).toBeDefined()
        expect(body.device).toMatchObject({
          id: sampleDevices[0].id,
          groupId: sampleDevices[0].group_id,
          serial: sampleDevices[0].serial,
          secret: expect.any(String),
          properties: sampleDevices[0].properties
        })
      })
    })

    describe('POST /devices/search', () => {
      it('should get all devices with given properties', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/devices/search?pageSize=8&page=1')
          .send({
            anotherProp: 'test'
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(201)

        expect(body.devices).toBeDefined()
        expect(body.devices).toHaveLength(1)
        expect(body.devices[0]).toMatchObject({
          id: sampleDevices[1].id,
          groupId: sampleDevices[1].group_id,
          serial: sampleDevices[1].serial,
          properties: sampleDevices[1].properties
        })
        expect(body.meta).toBeDefined()
        expect(body.meta.count).toEqual(1)
      })
    })

    describe('POST /devices', () => {
      it('should create a new device', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/devices')
          .send({
            serial: '3d605a75-f8b3-48da-b51c-6738bee4e054',
            groupId: groupsIds[0]
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
        deviceSerial = body.device.serial
        deviceSecret = body.device.secret

        expect(body.device).toBeDefined()
        expect(body.device).toMatchObject({
          id: expect.any(String),
          groupId: groupsIds[0],
          serial: deviceSerial,
          secret: expect.any(String),
          properties: {}
        })
      })
    })

    describe('POST /devices/auth', () => {
      it('should authenticate a device', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/devices/auth')
          .send({
            serial: deviceSerial,
            secret: deviceSecret
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(201)

        expect(body.authenticated).toBeDefined()
        expect(body.authenticated).toBeTruthy()
      })
    })

    describe('PUT /devices/:id', () => {
      it('should update a device group', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .put(`/devices/${sampleDevices[0].id}`)
          .send({ groupId: groupsIds[1] })
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        expect(body.device).toBeDefined()
        expect(body.device).toMatchObject({
          id: sampleDevices[0].id,
          groupId: groupsIds[1],
          serial: sampleDevices[0].serial,
          secret: expect.any(String),
          properties: sampleDevices[0].properties
        })
      })
    })

    describe('DELETE /devices/:id', () => {
      it('should delete a device', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .delete(`/devices/${sampleDevices[0].id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)

        expect(body.device).toBeDefined()
        expect(body.device).toMatchObject({
          groupId: groupsIds[1],
          serial: sampleDevices[0].serial,
          secret: expect.any(String),
          connected: false,
          properties: sampleDevices[0].properties
        })
      })
    })
  })

  describe('Logs', () => {
    describe('POST /logs', () => {
      it('should create a new log', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/logs')
          .send({ deviceId: sampleDevices[1].id, connected: true })
          .set('Authorization', `Bearer ${token}`)
          .expect(201)

        expect(body.log).toBeDefined()
        expect(body.log).toMatchObject({
          id: expect.any(String),
          deviceId: sampleDevices[1].id,
          connected: true
        })
      })
    })
  })

  describe('Timeseries', () => {
    describe('POST /timeseries', () => {
      it('should create a new timeseries entry', async () => {
        const { body } = await supertest
          .agent(app.getHttpServer())
          .post('/timeseries')
          .send({
            deviceId: sampleDevices[1].id,
            category: 'test',
            numericValue: 8
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(201)

        expect(body.timeseries).toBeDefined()
        expect(body.timeseries).toMatchObject({
          id: expect.any(String),
          deviceId: sampleDevices[1].id,
          category: 'test',
          numericValue: 8,
          stringValue: null,
          time: expect.any(String)
        })
      })
    })
  })
})

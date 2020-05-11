import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { User } from '../users/user.entity'

define(User, (faker: typeof Faker) => {
  const id = faker.random.uuid()
  const email = faker.internet.email()
  const username = faker.internet.userName()
  const password = faker.internet.password()
  const groupId = faker.random.uuid()

  const user = new User()
  user.id = id
  user.email = email
  user.username = username
  user.password = password
  user.groupId = groupId

  return user
})

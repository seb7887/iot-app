import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { Group } from '../groups/group.entity'

define(Group, (faker: typeof Faker) => {
  const id = faker.random.uuid()
  const parentId = faker.random.uuid()
  const name = faker.internet.userName()

  const group = new Group()
  group.id = id
  group.parentId = parentId
  group.name = name

  return group
})

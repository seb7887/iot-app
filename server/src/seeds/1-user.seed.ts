import { Seeder, Factory } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Group } from '../groups/group.entity'
import { User } from '../users/user.entity'
import { getGroupId } from '../utils'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(User)().create({
      email: 'admin@iot.com',
      password: 'admin1234',
      groupId: null
    })
    const groups = await connection
      .createQueryBuilder()
      .select('groups')
      .from(Group, 'groups')
      .getMany()
    const groupIds = groups.map(group => group.id)
    await factory(User)().createMany(50, {
      groupId: getGroupId(groupIds)
    })
  }
}

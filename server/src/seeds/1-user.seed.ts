import { Seeder, Factory } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Group } from '../groups/group.entity'
import { User, RoleType } from '../users/user.entity'
import { getGroupId } from '../utils'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const salt = bcrypt.genSaltSync(10)
    const password = bcrypt.hashSync('admin1234', salt)
    await factory(User)().create({
      email: 'admin@iot.com',
      password,
      role: RoleType.ADMIN,
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

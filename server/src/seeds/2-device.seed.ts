import { Seeder, Factory } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Group } from '../groups/group.entity'
import { Device } from '../devices/device.entity'
import { getGroupId } from '../utils'

export default class CreateDevices implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const groups = await connection
      .createQueryBuilder()
      .select('groups')
      .from(Group, 'groups')
      .getMany()
    const groupIds = groups.map(group => group.id)
    await factory(Device)().create({
      serial: 'Virtual',
      password: '123456',
      groupId: getGroupId(groupIds)
    })
    await factory(Device)().createMany(50, {
      groupId: getGroupId(groupIds)
    })
  }
}

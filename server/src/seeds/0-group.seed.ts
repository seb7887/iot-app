import { Seeder, Factory } from 'typeorm-seeding'
import { Group } from '../groups/group.entity'

export default class CreateGroups implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const parent1 = await factory(Group)().create({
      name: 'Type 1',
      parentId: null
    })
    const parent2 = await factory(Group)().create({
      name: 'Type 2',
      parentId: null
    })
    const parents = [parent1, parent2].map(p => p.id)
    const firstChild1 = await factory(Group)().createMany(2, {
      parentId: parents[0]
    })
    const firstChild2 = await factory(Group)().createMany(2, {
      parentId: parents[1]
    })
    await factory(Group)().createMany(2, {
      parentId: firstChild1[0].id
    })
    await factory(Group)().createMany(2, {
      parentId: firstChild1[1].id
    })
    await factory(Group)().createMany(2, {
      parentId: firstChild2[0].id
    })
    await factory(Group)().createMany(2, {
      parentId: firstChild2[1].id
    })
  }
}

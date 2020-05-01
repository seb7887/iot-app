import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { Group } from './group.entity'
import { CreateGroupDto, ListGroupsDto } from './dto'
import { GroupData, GroupRO, GroupListRO } from './group.interface'

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>
  ) {}

  async findById(id: string): Promise<GroupRO> {
    const group = await this.groupRepository.findOne(id)

    if (!group) {
      const errors = { User: 'Not Found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildGroupRO(group)
  }

  async getHierarchy(id: string): Promise<string[]> {
    const hierarchy = await getRepository(Group).query(
      `WITH RECURSIVE hierarchy(id, parent_id) AS (
        SELECT id, parent_id FROM groups WHERE id = $1
        UNION ALL
        SELECT g.id, g.parent_id FROM groups g INNER JOIN hierarchy h ON g.parent_id = h.id
      ) SELECT id from hierarchy`,
      [id]
    )

    return hierarchy.map(h => h.id)
  }

  async hasPermissions(userGroupId: string, groupId: string): Promise<boolean> {
    const ids = await this.getHierarchy(userGroupId)

    return ids.includes(groupId)
  }

  async listGroups(dto: ListGroupsDto): Promise<GroupListRO> {
    const { id, role, parentId, name, sortBy, sortOrder, pageSize, page } = dto
    const isAdmin = role === 'admin'

    const subgroups = id && !isAdmin ? await this.getHierarchy(id) : null

    const [groups, count] = await getRepository(Group)
      .createQueryBuilder('groups')
      .where(subgroups ? 'groups.id IN (:...subgroups)' : '1=1', { subgroups })
      .andWhere(parentId ? `groups.parent_id = :parentId` : `1=1`, { parentId })
      .andWhere(name ? `groups.name LIKE '%${name}%'` : '1=1')
      .orderBy(sortBy, sortOrder)
      .limit(pageSize)
      .offset((Number(page) - 1) * Number(pageSize))
      .getManyAndCount()

    return this.buildGroupListRO(groups, count, page, pageSize, sortOrder)
  }

  async create(dto: CreateGroupDto): Promise<GroupRO> {
    const { name, parentId } = dto

    const qb = getRepository(Group)
      .createQueryBuilder('groups')
      .where('groups.name = :name', { name })

    const group = await qb.getOne()

    if (group) {
      const errors = { username: 'Group name must be unique' }
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST
      )
    }

    // Create new group
    const newGroup = new Group()
    newGroup.name = name
    newGroup.parentId = parentId

    const errors = await validate(newGroup)

    if (errors.length > 0) {
      const _errors = { username: 'GroupInput is not valid' }
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST
      )
    } else {
      const savedGroup = await this.groupRepository.save(newGroup)
      return this.buildGroupRO(savedGroup)
    }
  }

  private buildGroupRO(group: Group) {
    const groupRO = {
      id: group.id,
      name: group.name,
      parentId: group.parentId
    }

    return {
      group: groupRO
    }
  }

  private buildGroupListRO(
    groups: Group[],
    count: number,
    page: number,
    pageSize: number,
    sortOrder: string
  ): GroupListRO {
    const groupsRO: GroupData[] = groups.map(g => ({
      id: g.id,
      name: g.name,
      parentId: g.parentId
    }))

    return {
      groups: groupsRO,
      meta: {
        count,
        page,
        pageSize,
        sortOrder
      }
    }
  }
}

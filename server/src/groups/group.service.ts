import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { Group } from './group.entity'
import { CreateGroupDto, ListGroupsDto } from './dto'
import { GroupRO, GroupListRO } from './group.interface'

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
    return getRepository(Group)
      .query(`WITH RECURSIVE hierarchy(id, parent_id) AS (
        SELECT id, parent_id FROM groups WHERE id = ${id}
        UNION ALL
        SELECT g.id, g.parent_id FROM groups g INNER JOIN hierarchy h ON g.parent_id = h.id
      ) SELECT id from hierarchy`)
  }

  async hasPermissions(userGroupId: string, groupId: string): Promise<boolean> {
    const ids = await this.getHierarchy(userGroupId)

    return ids.includes(groupId)
  }

  async findAll(dto: ListGroupsDto): Promise<GroupListRO[]> {
    const groups = await this.groupRepository.find()

    return this.buildGroupListRO(groups)
  }

  async listGroups(dto: ListGroupsDto): Promise<Group[]> {
    const { id, parentId, sortBy, sortOrder, pageSize, page } = dto

    const subgroups = await this.getHierarchy(id)

    const groups = await getRepository(
      Group
    ).query(
      `SELECT * FROM groups WHERE (id IN ($1:csv) or $1 is null) AND (parent_id = $2 or $2 is null) ORDER BY ${sortBy} ${sortOrder} LIMIT $3 OFFSET $4`,
      [subgroups, parentId, pageSize, page]
    )

    return this.buildGroupListRO(groups as Group[], page, pageSize, sortOrder)
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
    groups: any,
    page: number,
    pageSize: number,
    sortOrder: string
  ): GroupListRO {
    return {
      groups,
      meta: {
        count: groups.length,
        page,
        pageSize,
        sortOrder
      }
    }
  }
}

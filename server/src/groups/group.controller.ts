import { Get, Post, Body, Query, Controller, Param } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { CreateGroupDto } from './dto'
import { GroupService } from './group.service'
import { GroupRO, GroupListRO } from './group.interface'
import { User } from '../users/user.decorator'

@ApiBearerAuth()
@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('groups')
  async create(@Body() groupData: CreateGroupDto) {
    return this.groupService.create(groupData)
  }

  @Get('groups')
  async findAll(
    @User('role') role: string,
    @User('groupId') groupId: string,
    @Query() query
  ): Promise<GroupListRO> {
    const { parentId, sortBy, sortOrder, name, page, pageSize } = query

    return this.groupService.listGroups({
      id: groupId,
      role,
      parentId,
      name,
      sortBy,
      sortOrder,
      page,
      pageSize
    })
  }

  @Get('groups/:id')
  async findOne(@Param('id') id: string): Promise<GroupRO> {
    return this.groupService.findById(id)
  }
}

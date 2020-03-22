import {
  Get,
  Post,
  Put,
  Body,
  Query,
  Controller,
  Param,
  Delete
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { CreateDeviceDto } from './dto'
import { DeviceService } from './device.service'
import { DeviceRO, DeviceListRO } from './device.interface'
import { User } from '../users/user.decorator'

@ApiBearerAuth()
@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('devices')
  async create(@Body() deviceData: CreateDeviceDto) {
    return this.deviceService.create(deviceData)
  }

  @Get('devices')
  async findAll(
    @User('role') role: string,
    @User('groupId') groupId: string,
    @Query() query
  ): Promise<DeviceListRO> {
    const { sortBy, sortOrder, page, pageSize } = query

    return this.deviceService.listDevices({
      role,
      groupId,
      sortBy,
      sortOrder,
      page,
      pageSize
    })
  }

  @Get('devices/:id')
  async findOne(@Param('id') id: string): Promise<DeviceRO> {
    return this.deviceService.findById(id)
  }

  @Post('devices/search')
  async findByProp(
    @User('role') role: string,
    @User('groupId') groupId: string,
    @Query() query,
    @Body() props: Record<string, number | string>
  ): Promise<DeviceListRO> {
    const { sortBy, sortOrder, page, pageSize } = query

    return this.deviceService.findByProps({
      role,
      groupId,
      sortBy,
      sortOrder,
      page,
      pageSize,
      props
    })
  }

  @Delete('devices/:id')
  async deleteDevice(
    @User('role') role: string,
    @Body() id: string
  ): Promise<Record<string, boolean>> {
    return this.deviceService.deleteDevice(role, id)
  }

  @Put('devices/:id')
  async updateGroup(
    @Param('id') id: string,
    @User('role') role: string,
    @Body() groupId: string
  ): Promise<DeviceRO> {
    return this.deviceService.updateDeviceGroup(role, id, groupId)
  }
}

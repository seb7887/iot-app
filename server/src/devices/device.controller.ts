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

import { CreateDeviceDto, AuthDeviceDto, UpdateDeviceDto } from './dto'
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

  @Post('devices/auth')
  async authDevice(
    @Body() authData: AuthDeviceDto
  ): Promise<Record<string, boolean>> {
    const { deviceId, secret } = authData

    return this.deviceService.authDevice(deviceId, secret)
  }

  @Put('devices/:id')
  async updateGroup(
    @Param('id') id: string,
    @User('role') role: string,
    @Body() dto: UpdateDeviceDto
  ): Promise<DeviceRO> {
    return this.deviceService.updateDeviceGroup(role, id, dto)
  }

  @Delete('devices/:id')
  async deleteDevice(
    @User('role') role: string,
    @Param('id') id: string
  ): Promise<DeviceRO> {
    return this.deviceService.deleteDevice(role, id)
  }
}

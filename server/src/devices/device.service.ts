import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { DateTime } from 'luxon'

import { Group } from '../groups/group.entity'
import { Device } from './device.entity'
import { CreateDeviceDto, ListDevicesDto, SearchDevicesDto } from './dto'
import { DeviceData, DeviceRO, DeviceListRO } from './device.interface'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>
  ) {}

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

  async findById(id: string): Promise<DeviceRO> {
    const device = await this.deviceRepository.findOne(id)

    if (!device) {
      const errors = { Device: 'Not found' }
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND)
    }

    return this.buildDeviceRO(device)
  }

  async findByProps(dto: SearchDevicesDto): Promise<DeviceListRO> {
    const { props, groupId, role, page, pageSize, sortBy, sortOrder } = dto
    const isAdmin = role === 'admin'

    const subgroups =
      groupId && !isAdmin ? await this.getHierarchy(groupId) : null

    const [devices, count] = await getRepository(Device)
      .createQueryBuilder('devices')
      .where(subgroups ? 'devices.group_id IN (:...subgroups)' : '1=1', {
        subgroups
      })
      .andWhere('devices.properties @> :props', { props })
      .orderBy(sortBy, sortOrder)
      .limit(pageSize)
      .offset(Number(page) - 1)
      .getManyAndCount()

    return this.buildDeviceListRO(devices, count, page, pageSize, sortOrder)
  }

  async listDevices(dto: ListDevicesDto): Promise<DeviceListRO> {
    const { role, groupId, sortBy, sortOrder, pageSize, page } = dto
    const isAdmin = role === 'admin'

    const subgroups =
      groupId && !isAdmin ? await this.getHierarchy(groupId) : null

    const [devices, count] = await getRepository(Device)
      .createQueryBuilder('devices')
      .where(subgroups ? 'devices.group_id IN (:...subgroups)' : '1=1', {
        subgroups
      })
      .orderBy(sortBy, sortOrder)
      .limit(pageSize)
      .offset(Number(page) - 1)
      .getManyAndCount()

    return this.buildDeviceListRO(devices, count, page, pageSize, sortOrder)
  }

  async create(dto: CreateDeviceDto): Promise<DeviceRO> {
    const { serial, groupId } = dto

    const qb = getRepository(Device)
      .createQueryBuilder('devices')
      .where('devices.serial = :serial', { serial })

    const device = await qb.getOne()

    if (device) {
      const errors = { serial: 'Serial number must be unique' }
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST
      )
    }

    // Create new device
    const newDevice = new Device()
    newDevice.serial = serial
    newDevice.groupId = groupId
    newDevice.password = `${serial}${DateTime.local().toMillis()}`
    newDevice.properties = {}

    const errors = await validate(newDevice)

    if (errors.length > 0) {
      const _errors = { username: 'DeviceInput is not valid' }
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST
      )
    } else {
      await this.deviceRepository.save(newDevice)
      return this.buildDeviceRO(newDevice)
    }
  }

  async updateDeviceGroup(
    role: string,
    id: string,
    groupId: string
  ): Promise<DeviceRO> {
    if (role !== 'admin') {
      const errors = { role: 'User must be admin' }
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED)
    }

    const qb = getRepository(Device)
      .createQueryBuilder('devices')
      .where('devices.id = :id', { id })

    const device = await qb.getOne()

    if (!device) {
      const errors = { Device: 'Not found' }
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND)
    }

    const updateResult = await getRepository(Device)
      .createQueryBuilder()
      .update(Device)
      .set({ groupId })
      .where('id = :id', { id })
      .execute()

    if (updateResult.affected > 0) {
      const updatedDevice = await qb.getOne()
      return this.buildDeviceRO(updatedDevice)
    } else {
      const errors = { operations: 'Cannot update device group' }
      throw new HttpException({ errors }, HttpStatus.BAD_REQUEST)
    }
  }

  async deleteDevice(
    role: string,
    id: string
  ): Promise<Record<string, boolean>> {
    if (role !== 'admin') {
      const errors = { role: 'User must be admin' }
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED)
    }

    const qb = getRepository(Device)
      .createQueryBuilder('devices')
      .where('devices.id = :id', { id })

    const device = await qb.getOne()

    if (!device) {
      const errors = { Device: 'Not found' }
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND)
    }

    const deleteResult = await getRepository(Device)
      .createQueryBuilder('devices')
      .delete()
      .where('devices.id = :id', { id })
      .execute()

    return deleteResult.affected > 0 ? { success: true } : { success: false }
  }

  private buildDeviceRO(device: Device) {
    const deviceRO = {
      id: device.id,
      groupId: device.groupId,
      serial: device.serial,
      secret: device.password,
      connected: device.connected,
      properties: device.properties
    }

    return {
      device: deviceRO
    }
  }

  private buildDeviceListRO(
    devices: Device[],
    count: number,
    page: number,
    pageSize: number,
    sortOrder: string
  ) {
    const devicesRO: DeviceData[] = devices.map(device => ({
      id: device.id,
      groupId: device.groupId,
      serial: device.serial,
      connected: device.connected,
      properties: device.properties
    }))

    return {
      devices: devicesRO,
      meta: {
        count,
        page,
        pageSize,
        sortOrder
      }
    }
  }
}

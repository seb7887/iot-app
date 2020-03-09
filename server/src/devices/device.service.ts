import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { validate } from 'class-validator'
import { DateTime } from 'luxon'

import { Device } from './device.entity'
import { CreateDeviceDto } from './dto'
import { DeviceData, DeviceRO } from './device.interface'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>
  ) {}

  async findById(id: string): Promise<DeviceRO> {
    const device = await this.deviceRepository.findOne(id)

    if (!device) {
      const errors = { Device: 'Not found' }
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND)
    }

    return this.buildDeviceRO(device)
  }

  async create(dto: CreateDeviceDto): Promise<DeviceRO> {
    const { serial, groupId } = dto

    const qb = await getRepository(Device)
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
}

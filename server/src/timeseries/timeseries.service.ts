import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { Timeseries } from './timeseries.entity'
import {
  TimeseriesRO,
  TimeseriesListRO,
  TimeseriesData
} from './timeseries.interface'
import { CreateTimeseriesDto, ListTimeseriesDto } from './dto'

@Injectable()
export class TimeseriesService {
  constructor(
    @InjectRepository(Timeseries)
    private readonly timeseriesRepository: Repository<Timeseries>
  ) {}

  async create(dto: CreateTimeseriesDto): Promise<TimeseriesRO> {
    const { deviceId, category, numericValue, stringValue } = dto

    // Create new Timeseries
    const newTS = new Timeseries()
    newTS.deviceId = deviceId
    newTS.category = category
    newTS.numericValue = numericValue
    newTS.stringValue = stringValue

    const errors = await validate(newTS)

    if (errors.length > 0) {
      const _errors = { input: 'TimeseriesInput is not valid' }
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST
      )
    } else {
      const ts = await this.timeseriesRepository.save(newTS)
      return this.buildTSRO(ts)
    }
  }

  async listTimeseries(dto: ListTimeseriesDto): Promise<TimeseriesListRO> {
    const { deviceId, category, sortBy, sortOrder, page, pageSize } = dto

    const [timeseries, count] = await getRepository(Timeseries)
      .createQueryBuilder('timeseries')
      .where(deviceId ? 'timeseries.device_id = :deviceId' : '1 = 1', {
        deviceId
      })
      .andWhere(category ? 'timeseries.category = :connected' : '1 = 1', {
        category
      })
      .orderBy(sortBy, sortOrder)
      .limit(pageSize)
      .offset((Number(page) - 1) * Number(pageSize))
      .getManyAndCount()

    return this.buildTSListRO(timeseries, count, page, pageSize, sortOrder)
  }

  private buildTSRO(ts: Timeseries) {
    const tsRO = {
      id: ts.id,
      deviceId: ts.deviceId,
      category: ts.category,
      numericValue: ts.numericValue,
      stringValue: ts.stringValue,
      time: ts.time
    }

    return {
      timeseries: tsRO
    }
  }

  private buildTSListRO(
    timeseries: Timeseries[],
    count: number,
    page: number,
    pageSize: number,
    sortOrder: string
  ) {
    const tsRO: TimeseriesData[] = timeseries.map(ts => ({
      id: ts.id,
      deviceId: ts.deviceId,
      category: ts.category,
      numericValue: ts.numericValue,
      stringValue: ts.stringValue,
      time: ts.time
    }))

    return {
      timeseries: tsRO,
      meta: {
        count,
        page,
        pageSize,
        sortOrder
      }
    }
  }
}

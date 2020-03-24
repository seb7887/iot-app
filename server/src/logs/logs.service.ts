import { Injectable, HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { Logs } from './logs.entity'
import { LogRO, LogsListRO, LogData } from './logs.interface'
import { CreateLogDto, ListLogsDto } from './dto'

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>
  ) {}

  async create(dto: CreateLogDto): Promise<LogRO> {
    const { deviceId, connected } = dto

    // Create new Log
    const newLog = new Logs()
    newLog.deviceId = deviceId
    newLog.connected = connected

    const errors = await validate(newLog)

    if (errors.length > 0) {
      const _errors = { input: 'LogInput is not valid' }
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST
      )
    } else {
      const log = await this.logsRepository.save(newLog)
      return this.buildLogRO(log)
    }
  }

  async listLogs(dto: ListLogsDto): Promise<LogsListRO> {
    const { deviceId, connected, sortBy, sortOrder, page, pageSize } = dto

    const [logs, count] = await getRepository(Logs)
      .createQueryBuilder('logs')
      .where(deviceId ? 'logs.device_id = :deviceId' : '1 = 1', { deviceId })
      .andWhere(connected ? 'logs.connected = :connected' : '1 = 1', {
        connected
      })
      .orderBy(sortBy, sortOrder)
      .limit(pageSize)
      .offset(Number(page) - 1)
      .getManyAndCount()

    return this.buildLogListRO(logs, count, page, pageSize, sortOrder)
  }

  private buildLogRO(log: Logs) {
    const logRO = {
      id: log.id,
      deviceId: log.deviceId,
      connected: log.connected
    }

    return {
      log: logRO
    }
  }

  private buildLogListRO(
    logs: Logs[],
    count: number,
    page: number,
    pageSize: number,
    sortOrder: string
  ) {
    const logsRO: LogData[] = logs.map(log => ({
      id: log.id,
      deviceId: log.deviceId,
      connected: log.connected
    }))

    return {
      logs: logsRO,
      meta: {
        count,
        page,
        pageSize,
        sortOrder
      }
    }
  }
}

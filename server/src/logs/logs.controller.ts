import { Get, Post, Body, Query, Controller } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { CreateLogDto } from './dto'
import { LogRO, LogsListRO } from './logs.interface'
import { LogsService } from './logs.service'

@ApiBearerAuth()
@Controller()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('logs')
  async createLog(@Body() dto: CreateLogDto): Promise<LogRO> {
    return this.logsService.create(dto)
  }

  @Get('logs')
  async listLogs(@Query() query): Promise<LogsListRO> {
    const { deviceId, connected, sortBy, sortOrder, page, pageSize } = query

    return this.listLogs({
      deviceId,
      connected,
      sortBy,
      sortOrder,
      page,
      pageSize
    })
  }
}

import { Get, Post, Body, Query, Controller } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'

import { CreateTimeseriesDto } from './dto'
import { TimeseriesRO, TimeseriesListRO } from './timeseries.interface'
import { TimeseriesService } from './timeseries.service'

@ApiBearerAuth()
@Controller()
export class TimeseriesController {
  constructor(private readonly timeseriesService: TimeseriesService) {}

  @Post('timeseries')
  async createTs(@Body() dto: CreateTimeseriesDto): Promise<TimeseriesRO> {
    return this.timeseriesService.create(dto)
  }

  @Get('timeseries')
  async listTs(@Query() query): Promise<TimeseriesListRO> {
    const { deviceId, category, sortBy, sortOrder, page, pageSize } = query

    return this.timeseriesService.listTimeseries({
      deviceId,
      category,
      sortBy,
      sortOrder,
      page,
      pageSize
    })
  }
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../users/user.module'
import { AuthMiddleware } from '../users/auth.middleware'
import { TimeseriesController } from './timeseries.controller'
import { Timeseries } from './timeseries.entity'
import { TimeseriesService } from './timeseries.service'

@Module({
  imports: [TypeOrmModule.forFeature([Timeseries]), UserModule],
  providers: [TimeseriesService],
  controllers: [TimeseriesController],
  exports: [TimeseriesService]
})
export class TimeseriesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'timeseries',
      method: RequestMethod.ALL
    })
  }
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../users/user.module'
import { AuthMiddleware } from '../users/auth.middleware'
import { LogsController } from './logs.controller'
import { Logs } from './logs.entity'
import { LogsService } from './logs.service'

@Module({
  imports: [TypeOrmModule.forFeature([Logs]), UserModule],
  providers: [LogsService],
  controllers: [LogsController],
  exports: [LogsService]
})
export class LogsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'logs',
      method: RequestMethod.ALL
    })
  }
}

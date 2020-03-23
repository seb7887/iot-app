import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../users/user.module'
import { GroupModule } from '../groups/group.module'
import { AuthMiddleware } from '../users/auth.middleware'
import { DeviceController } from './device.controller'
import { Device } from './device.entity'
import { DeviceService } from './device.service'

@Module({
  imports: [TypeOrmModule.forFeature([Device]), UserModule, GroupModule],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService]
})
export class DeviceModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'devices',
        method: RequestMethod.GET
      },
      {
        path: 'devices/:id',
        method: RequestMethod.ALL
      },
      {
        path: 'devices',
        method: RequestMethod.POST
      }
    )
  }
}

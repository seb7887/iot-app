import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../users/user.module'
import { AuthMiddleware } from '../users/auth.middleware'
import { GroupController } from './group.controller'
import { Group } from './group.entity'
import { GroupService } from './group.service'

@Module({
  imports: [TypeOrmModule.forFeature([Group]), UserModule],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupService]
})
export class GroupModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'groups',
        method: RequestMethod.GET
      },
      {
        path: 'groups',
        method: RequestMethod.POST
      }
    )
  }
}

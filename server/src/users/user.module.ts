import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthMiddleware } from './auth.middleware'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'users',
        method: RequestMethod.GET
      },
      {
        path: 'users',
        method: RequestMethod.PUT
      }
    )
  }
}

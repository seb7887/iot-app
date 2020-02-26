import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
// Users module
import { UserModule } from './users/user.module'
// Groups module
import { GroupModule } from './groups/group.module'
// Devices module
// Logs module
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, GroupModule],
  controllers: [AppController],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}

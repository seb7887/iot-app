import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
// Users module
import { UserModule } from './users/user.module'
// Groups module
import { GroupModule } from './groups/group.module'
// Devices module
import { DeviceModule } from './devices/device.module'
// Logs module
import { LogsModule } from './logs/logs.module'
// Timeseries module
import { TimeseriesModule } from './timeseries/timeseries.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    GroupModule,
    DeviceModule,
    LogsModule,
    TimeseriesModule
  ],
  controllers: [AppController],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
// Devices module
// Users module
// Groups module
// Profile module
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@Module({
  imports: [TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ApplicationModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const appOptions = { cors: true }
  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    appOptions
  )
  app.setGlobalPrefix('api')

  const options = new DocumentBuilder()
    .setTitle('NestJS IoT App')
    .setDescription('The IoT API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/docs', app, document)

  await app.listen(7777)
}

bootstrap()

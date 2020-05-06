import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ApplicationModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'

async function bootstrap() {
  const appOptions = { cors: true }
  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    appOptions
  )
  app.setGlobalPrefix('api')
  app.enableCors()
  app.use(compression())
  app.use(helmet())
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes,
      max: 100 // limit each IP to 100 request per windowMs
    })
  )

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

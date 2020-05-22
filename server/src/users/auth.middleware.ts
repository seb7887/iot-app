import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'

import { SECRET } from '../config'
import { UserService } from './user.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    @InjectPinoLogger(AuthMiddleware.name) private readonly logger: PinoLogger
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization
    if (authHeaders && authHeaders.split(' ')[1]) {
      const token = authHeaders.split(' ')[1]
      let user

      // If API KEY is provided
      if (token !== process.env.API_KEY) {
        const decoded: any = verify(token, SECRET)
        this.logger.trace({ decoded }, `Decoded JWT`)
        user = await this.userService.findById(decoded.id)

        if (!user) {
          this.logger.error('User not found')
          throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
        }
      } else {
        user = await this.userService.findByEmail('admin@iot.com')
      }

      req.user = user.user
      next()
    } else {
      this.logger.error('Unauthorized')
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
  }
}

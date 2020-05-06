import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { SECRET } from '../config'
import { UserService } from './user.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization
    if (authHeaders && authHeaders.split(' ')[1]) {
      const token = authHeaders.split(' ')[1]
      let user

      // If API KEY is provided
      if (token !== process.env.API_KEY) {
        const decoded: any = verify(token, SECRET)
        user = await this.userService.findById(decoded.id)

        if (!user) {
          throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
        }
      } else {
        user = await this.userService.findByEmail('admin@iot.com')
      }

      req.user = user.user
      next()
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
  }
}

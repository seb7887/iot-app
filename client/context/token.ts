import { NextPageContext } from 'next/types'
import Cookies from 'universal-cookie'

import { validateJwt } from '../services/api'

export class Token {
  public saveToken(token: string) {
    const cookies = new Cookies()
    cookies.set('token', token, { path: '/', maxAge: 31536000 })
    return Promise.resolve()
  }

  public getToken(ctx?: NextPageContext) {
    const cookies = new Cookies(ctx?.req ? ctx.req.headers.cookie : null)
    return cookies.get('token')
  }

  public clearToken() {
    const cookies = new Cookies()
    cookies.remove('token')
  }

  public checkAuthToken(token: string) {
    return validateJwt(token)
  }

  public async authenticateSsr(ctx: NextPageContext) {
    const cookies = new Cookies(ctx.req ? ctx.req.headers.cookie : null)
    const token = cookies.get('token')

    if (!token) {
      return false
    }

    const res = await this.checkAuthToken(token)
    return res.isValid
  }
}

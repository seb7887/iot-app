import { NextPageContext } from 'next/types'
import Cookies from 'universal-cookie'

import { validateJwt } from '../services/api'
import { redirectUser } from '../services/nav'

export class Token {
  public saveToken(token: string) {
    const cookies = new Cookies()
    cookies.set('token', token, { path: '/' })
    return Promise.resolve()
  }

  public checkAuthToken(token: string) {
    return validateJwt(token)
  }

  public async authenticateSsr(ctx: NextPageContext) {
    const cookies = new Cookies(ctx.req ? ctx.req.headers.cookie : null)
    const token = cookies.get('token')

    const res = await this.checkAuthToken(token)
    if (!res) {
      redirectUser('/', ctx)
    }
  }
}

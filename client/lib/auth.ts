import { NextPageContext } from 'next'

import { Token } from '../context'
import { redirectUser } from '../services/nav'

export const authInitialProps = (isProtectedRoute?: boolean) => async (
  ctx: NextPageContext
) => {
  const tokenService = new Token()
  let auth
  try {
    auth = await tokenService.authenticateSsr(ctx)
  } catch {
    auth = null
  }

  if (auth === false) {
    tokenService.clearToken()
  }

  const currentPath = ctx.req ? ctx.req.url : window.location.pathname

  if (
    isProtectedRoute &&
    !auth &&
    currentPath !== '/' &&
    currentPath !== '/reset-password'
  ) {
    redirectUser('/', ctx)
  }

  if (auth && (currentPath === '/' || currentPath === '/reset-password')) {
    redirectUser('/dashboard', ctx)
  }

  return {
    auth
  }
}

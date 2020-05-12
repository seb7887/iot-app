import { useRouter } from 'next/router'
import { NextPageContext } from 'next/types'

export const redirectUser = (dest: string, ctx: NextPageContext) => {
  const router = useRouter()
  const res = ctx.res

  if (res) {
    res.writeHead(302, { Location: dest })
    res.end()
  } else {
    router.push(dest)
  }
}

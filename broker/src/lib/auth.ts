import { AuthenticateError, AuthenticateHandler } from 'aedes'

import { checkAuthentication } from './api'
import logger from './logger'

const authenticate: AuthenticateHandler = (
  client,
  username,
  password,
  callback
) => {
  let error
  const type: Connection = client.req ? 'ws' : 'device'

  if (!password) {
    logger.error(`Authentication Error: No password provided`)
    error = new Error('No password provided') as AuthenticateError
    error.returnCode = 5
    return callback(error, false)
  }

  logger.trace(
    { type, username, password: password.toString() },
    `Performing authentication...`
  )

  checkAuthentication(type, username, password.toString())
    .then((isAuthenticated) => {
      if (isAuthenticated) {
        logger.trace({ username }, `Successfully authenticated`)
        return callback(null, true)
      }

      error = new Error('Incorrect username or password') as AuthenticateError
      error.returnCode = 4

      logger.error({ username }, error.message)

      callback(error, false)
    })
    .catch((err) => {
      logger.error(err)

      return callback(err, false)
    })
}

export default authenticate

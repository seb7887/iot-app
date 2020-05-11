/// <reference path="./index.d.ts" />
import 'dotenv/config'

import path from 'path'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import ws from 'websocket-stream'

import logger from './lib/logger'
import broker from './lib/broker'

const dev = process.env.NODE_ENV === 'development'

const MQTT_PORT = dev ? process.env.MQTT_PORT : process.env.TLS_PORT
const WS_PORT = dev ? process.env.WS_PORT : process.env.SSL_PORT

;(async () => {
  let mqttServer
  let httpServer

  if (dev) {
    const net = await import('net')
    const http = await import('http')
    mqttServer = net.createServer(broker.handle)
    httpServer = http.createServer()
  } else {
    const tls = await import('tls')
    const https = await import('https')
    const KEY_PATH = path.join(homedir(), process.env.KEY_FILE || '')
    const CERT_PATH = path.join(homedir(), process.env.CERT_FILE || '')
    const CA_PATH = path.join(homedir(), process.env.CA_FILE || '')
    const key = readFileSync(KEY_PATH)
    const cert = readFileSync(CERT_PATH)
    const ca = readFileSync(CA_PATH)

    const SSLoptions = {
      key,
      cert,
    }

    const TLSoptions = {
      key,
      cert,
      ca,
    }

    mqttServer = tls.createServer(TLSoptions)
    httpServer = https.createServer(SSLoptions)
  }

  ws.createServer({ server: httpServer }, broker.handle as any)

  // Start Websocket Server
  httpServer.listen(WS_PORT)

  // Start MQTT Server
  mqttServer.listen(MQTT_PORT, () => {
    logger.info(`Server listening on port ${MQTT_PORT}`)
  })
})()

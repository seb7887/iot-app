/// <reference path="./index.d.ts" />
import 'dotenv/config'
import redis from 'redis'

import logger from './lib/logger'
import processor from './lib/processor'

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
  retry_strategy: () => 1000,
})

const sub = redisClient.duplicate()

sub.subscribe('telemetry')

sub.on('message', (channel, message) => {
  logger.info({ message }, `Received message on channel '${channel}'`)
  const msg = JSON.parse(message)
  processor(msg)
})

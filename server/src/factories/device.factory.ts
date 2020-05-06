import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { DateTime } from 'luxon'
import { Device } from '../devices/device.entity'

define(Device, (faker: typeof Faker) => {
  const id = faker.random.uuid()
  const groupId = faker.random.uuid()
  const serial = faker.random.uuid()
  const password = `${serial}${DateTime.local().toMillis()}`
  const connected = faker.random.boolean()
  const properties = {
    firmwareVersion: 1,
    latitude: +faker.helpers.createCard().address.geo.lat,
    longitude: +faker.helpers.createCard().address.geo.lng,
    ip: faker.internet.ip(),
    mac: faker.internet.mac()
  }

  const device = new Device()
  device.id = id
  device.groupId = groupId
  device.serial = serial
  device.password = password
  device.connected = connected
  device.properties = properties

  return device
})

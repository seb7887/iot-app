const faker = require('faker')

const CATEGORIES = ['temperature', 'humidity', 'location']

const randomCategory = () =>
  CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]

const randomValue = (category) => {
  const isNumeric = category === 'temperature' || category === 'humidity'
  const randomNumeric = faker.random.number()
  const randomLocation = `${+faker.helpers.createCard().address.geo
    .lat}|${+faker.helpers.createCard().address.geo.lng}`

  return isNumeric ? randomNumeric : randomLocation
}

const generateMessage = () => {
  const category = randomCategory()
  const value = randomValue(category)

  return {
    category,
    value,
  }
}

module.exports = generateMessage

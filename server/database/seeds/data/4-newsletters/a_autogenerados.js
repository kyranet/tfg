const bcrypt = require('bcryptjs');
const faker = require('faker');
faker.locale = 'es';
const { ROLES } = require('../../../../models/rol.model');

const entities_to_generate = 20;

function generateSuscripciones() {

  let suscripciones = []

  for (let id=1; id <= (entities_to_generate + 1); id++) {

    let date = faker.date.recent();

    suscripciones.push({
        mail_to: faker.internet.email(),
        createdAt: date,
        updatedAt: date,
    });
  }

  return suscripciones;
}

module.exports = generateSuscripciones();

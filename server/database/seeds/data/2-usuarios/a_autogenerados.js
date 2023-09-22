const bcrypt = require('bcryptjs');
const faker = require('faker');
faker.locale = 'es';
const { ROLES } = require('../../../../models/rol.model');

const entities_to_generate = 60;

function generateUsers() {

  let users = []

  for (let id=1; id <= (entities_to_generate + 1); id++) {

    let rol = faker.random.arrayElement(ROLES);
    let date = faker.date.recent();

    users.push({
        email: faker.internet.email(),
        nombre: faker.name.firstName(),
        apellidos: faker.name.lastName(),
        password: bcrypt.hashSync('demo', bcrypt.genSaltSync()),
        universidad: rol === 'ROL_PROFESOR' || rol === 'ROL_ESTUDIANTE' ? faker.lorem.word : '',
        titulacion: rol === 'ROL_PROFESOR' || rol === 'ROL_ESTUDIANTE' ? faker.lorem.word : '',
        sector: rol === 'ROL_ENTIDAD' ? faker.lorem.word : '',
        terminos_aceptados: true,
        origin_login: 'Portal ApS',
        origin_img: '',
        rol: rol,
        createdAt: date,
        updatedAt: date,
    });
  }

  return users
}

module.exports = generateUsers();
